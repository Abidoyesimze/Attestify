import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { expect } from "chai";
import { network } from "hardhat";
import { encodeFunctionData } from "viem";

describe("AttestifyVault Integration", async () => {
  const { viem } = await network.connect();
  const wallets = await viem.getWalletClients();
  const [deployer, alice, bob, carol] = wallets;
  const ONE = 10n ** 18n;

  async function deployVaultIntegrationFixture() {
    const asset = await viem.deployContract(
      "contracts/mocks/MockERC20.sol:MockERC20",
      ["Mock USD", "MUSD"],
    );
    const verifier = await viem.deployContract(
      "contracts/mocks/MockVerifier.sol:MockVerifier",
    );
    const strategy = await viem.deployContract(
      "contracts/mocks/MockStrategy.sol:MockStrategy",
      [asset.address],
    );
    const vaultImpl = await viem.deployContract(
      "contracts/AttestifyVault.sol:AttestifyVault",
    );

    const maxUser = 1_000_000n * ONE;
    const maxTotal = 10_000_000n * ONE;

    const initCalldata = encodeFunctionData({
      abi: vaultImpl.abi,
      functionName: "initialize",
      args: [asset.address, strategy.address, verifier.address, maxUser, maxTotal],
    });

    const proxy = await viem.deployContract(
      "contracts/mocks/TestProxy.sol:TestProxy",
      [vaultImpl.address, initCalldata],
    );

    const vault = await viem.getContractAt(
      "contracts/AttestifyVault.sol:AttestifyVault",
      proxy.address,
    );
    await strategy.write.setVault([vault.address], { account: deployer.account });

    const mintAmount = 100_000n * ONE;
    for (const wallet of [deployer, alice, bob, carol]) {
      await asset.write.mint([wallet.account.address, mintAmount], {
        account: deployer.account,
      });
    }

    return { asset, verifier, strategy, vault };
  }

  async function verifyUsers(verifier: any, users: string[]) {
    for (const user of users) {
      await verifier.write.setVerified([user, true], {
        account: deployer.account,
      });
    }
  }

  async function expectRevert(promise: Promise<unknown>, reason?: string) {
    await assert.rejects(promise, (error: any) => {
      const names = [
        error?.cause?.data?.errorName,
        error?.cause?.cause?.errorName,
        error?.cause?.cause?.data?.errorName,
        error?.cause?.errorName,
        error?.errorName,
      ].filter(Boolean);

      if (reason && names.some((name) => name === reason)) {
        return true;
      }

      const details = [
        error?.message,
        error?.shortMessage,
        error?.details,
        error?.cause?.message,
        error?.cause?.shortMessage,
        error?.cause?.details,
        error?.cause?.cause?.details,
      ]
        .filter(Boolean)
        .join(" ");

      if (!reason) return true;
      return details.includes(reason);
    });
  }

  it("blocks unverified deposits on forked hardhat network", async () => {
    const { asset, verifier, vault } = await deployVaultIntegrationFixture();
    const depositAmount = 100n * ONE;

    await asset.write.approve([vault.address, depositAmount], {
      account: alice.account,
    });
    await expectRevert(
      vault.write.deposit([depositAmount], { account: alice.account }),
      "NotVerified",
    );

    await verifyUsers(verifier, [alice.account.address]);
    await vault.write.deposit([depositAmount], { account: alice.account });

    const balance = await vault.read.balanceOf([alice.account.address]);
    expect(balance).to.equal(depositAmount);
  });

  it("protects share price against donation manipulation", async () => {
    const { asset, verifier, vault } = await deployVaultIntegrationFixture();
    await verifyUsers(verifier, [alice.account.address, bob.account.address]);

    const smallDeposit = 1n * ONE;
    const donation = 1_000n * ONE;
    const bobDeposit = 2_000n * ONE;

    await asset.write.approve([vault.address, smallDeposit], {
      account: alice.account,
    });
    await vault.write.deposit([smallDeposit], { account: alice.account });

    await asset.write.transfer([vault.address, donation], {
      account: deployer.account,
    });

    await asset.write.approve([vault.address, bobDeposit], {
      account: bob.account,
    });
    await vault.write.deposit([bobDeposit], { account: bob.account });

    const bobBalance = await vault.read.balanceOf([bob.account.address]);
    expect(bobBalance).to.be.gte(bobDeposit - 2n);
  });

  it("enforces minimum assets out on withdrawal", async () => {
    const { asset, verifier, vault } = await deployVaultIntegrationFixture();
    await verifyUsers(verifier, [bob.account.address]);

    const depositAmount = 500n * ONE;
    await asset.write.approve([vault.address, depositAmount], {
      account: bob.account,
    });
    await vault.write.deposit([depositAmount], { account: bob.account });

    await expectRevert(
      vault.write.withdraw(
        [depositAmount / 2n, depositAmount / 2n + 1n],
        { account: bob.account },
      ),
      "SlippageTooHigh",
    );
  });

  it("allows withdrawing entire balance via withdrawAll", async () => {
    const { asset, verifier, vault } = await deployVaultIntegrationFixture();
    await verifyUsers(verifier, [alice.account.address]);

    const depositAmount = 800n * ONE;
    await asset.write.approve([vault.address, depositAmount], {
      account: alice.account,
    });
    await vault.write.deposit([depositAmount], { account: alice.account });

    await vault.write.withdrawAll({ account: alice.account });

    const shareBalance = await vault.read.shares([alice.account.address]);
    const assetBalance = await vault.read.balanceOf([alice.account.address]);
    expect(shareBalance).to.equal(0n);
    expect(assetBalance).to.equal(0n);
  });

  it("maintains reserve ratios when users withdraw", async () => {
    const { asset, verifier, strategy, vault } = await deployVaultIntegrationFixture();
    await verifyUsers(verifier, [alice.account.address]);

    const depositAmount = 1_000n * ONE;
    await asset.write.approve([vault.address, depositAmount], {
      account: alice.account,
    });
    await vault.write.deposit([depositAmount], { account: alice.account });

    await vault.write.withdraw([200n * ONE], { account: alice.account });

    const reserveBalance = await asset.read.balanceOf([vault.address]);
    const strategyBalance = await strategy.read.totalAssets();
    const totalAssets = await vault.read.totalAssets();
    const targetReserve = (totalAssets * 10n) / 100n;

    expect(totalAssets).to.equal(depositAmount - 200n * ONE);
    expect(reserveBalance).to.be.gte(targetReserve);
    expect(strategyBalance).to.equal(totalAssets - reserveBalance);
  });

  it("enforces limits and pause controls", async () => {
    const { asset, verifier, vault } = await deployVaultIntegrationFixture();
    await verifyUsers(verifier, [alice.account.address, bob.account.address]);

    const userLimit = 500n * ONE;
    const totalLimit = 1_000n * ONE;
    await vault.write.setLimits([userLimit, totalLimit], {
      account: deployer.account,
    });

    await asset.write.approve([vault.address, 600n * ONE], {
      account: alice.account,
    });
    await expectRevert(
      vault.write.deposit([600n * ONE], { account: alice.account }),
    );

    await asset.write.approve([vault.address, userLimit], {
      account: alice.account,
    });
    await vault.write.deposit([userLimit], { account: alice.account });

    await asset.write.approve([vault.address, 600n * ONE], {
      account: bob.account,
    });
    await expectRevert(
      vault.write.deposit([600n * ONE], { account: bob.account }),
    );

    const totalAfter = await vault.read.totalAssets();
    expect(totalAfter).to.equal(userLimit);

    await vault.write.pause({ account: deployer.account });
    await expectRevert(
      vault.write.deposit([100n * ONE], { account: bob.account }),
      "EnforcedPause",
    );

    await vault.write.unpause({ account: deployer.account });
    await vault.write.setLimits([userLimit, 2_000n * ONE], {
      account: deployer.account,
    });
    await vault.write.deposit([400n * ONE], { account: bob.account });
  });

  it("restricts admin functions and supports emergency withdraw", async () => {
    const { asset, verifier, vault } = await deployVaultIntegrationFixture();
    await verifyUsers(verifier, [alice.account.address]);

    await expectRevert(
      vault.write.pause({ account: alice.account }),
      "OwnableUnauthorizedAccount",
    );

    await vault.write.pause({ account: deployer.account });

    const reserveBalance = await asset.read.balanceOf([vault.address]);
    const ownerBefore = await asset.read.balanceOf([deployer.account.address]);

    await vault.write.emergencyWithdraw(
      [asset.address, reserveBalance],
      { account: deployer.account },
    );

    const ownerAfter = await asset.read.balanceOf([deployer.account.address]);
    expect(ownerAfter - ownerBefore).to.equal(reserveBalance);
  });

  it("allows owner or delegated rebalancer to maintain reserves", async () => {
    const { asset, verifier, vault } = await deployVaultIntegrationFixture();
    await verifyUsers(verifier, [alice.account.address]);

    await asset.write.approve([vault.address, 2_000n * ONE], {
      account: alice.account,
    });
    await vault.write.deposit([2_000n * ONE], { account: alice.account });

    await expectRevert(
      vault.write.rebalance({ account: carol.account }),
      "Unauthorized",
    );

    await vault.write.setRebalancer([bob.account.address], {
      account: deployer.account,
    });

    await asset.write.transfer([vault.address, 5_000n * ONE], {
      account: deployer.account,
    });

    await vault.write.rebalance({ account: bob.account });

    const totalAssets = await vault.read.totalAssets();
    const reserveBalance = await asset.read.balanceOf([vault.address]);
    const targetReserve = (totalAssets * 10n) / 100n;

    expect(reserveBalance).to.be.gte(targetReserve);
    expect(reserveBalance).to.be.lte(targetReserve * 2n);
  });
});


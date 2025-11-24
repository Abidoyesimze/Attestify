import { describe, it } from "node:test";
import { expect } from "chai";
import { network } from "hardhat";
import type { Address } from "viem";

const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";
const ACUSD_ADDRESS = "0xBba98352628B0B0c4b40583F593fFCb630935a45";
const AAVE_PROVIDER_ADDRESS = "0x9F7Cf9417D5251C59fE94fB9147feEe1aAd9Cea5";
const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

const CUSD_WHALES = [
  "0x918146359264C492BD6934071c6Bd31C854EDBc3", // Mento reserve
  "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402", // Aave pool holding cUSD
  "0xC959439207dA5341B74aDcdAC59016aa9Be7E9E7",
  "0x1a8Dbe5958c597a744Ba51763AbEBD3355996c3e",
  "0x73F93dcc49cB8A239e2032663e9475dd5ef29A08",
  "0x4aAD04D41FD7fd495503731C5a2579e19054C432",
];

const ONE = 10n ** 18n;

async function fundVaultWithCusd(
  target: string,
  amount: bigint,
  cUSD: any,
  ethersLib: any,
  testClient: any,
) {
  for (const whale of CUSD_WHALES) {
    const balance = await cUSD.balanceOf(whale);
    if (balance < amount) continue;

    await testClient.impersonateAccount({ address: whale as Address });
    await testClient.setBalance({
      address: whale as Address,
      value: 100n * 10n ** 18n,
    });

    const whaleSigner = await ethersLib.getSigner(whale);
    await cUSD.connect(whaleSigner).transfer(target, amount);

    await testClient.stopImpersonatingAccount({ address: whale as Address });
    return whale;
  }

  throw new Error("Unable to locate a cUSD whale with sufficient balance");
}

async function deployStrategyFixture() {
  const { ethers, viem } = await network.connect();
  const [vaultSigner] = await ethers.getSigners();
  const cUSD = new ethers.Contract(CUSD_ADDRESS, ERC20_ABI, ethers.provider);
  const Strategy = await ethers.getContractFactory("AaveV3Strategy");
  const strategy = await Strategy.deploy(
    CUSD_ADDRESS,
    ACUSD_ADDRESS,
    AAVE_PROVIDER_ADDRESS,
  );
  await strategy.waitForDeployment();
  await strategy.setVault(vaultSigner.address);

  const fundingAmount = 120n * ONE;
  const testClient = await viem.getTestClient();
  await fundVaultWithCusd(
    vaultSigner.address,
    fundingAmount,
    cUSD,
    ethers,
    testClient,
  );

  return { strategy, cUSD, vaultSigner, testClient };
}

function expectApproxEqual(
  actual: bigint,
  expected: bigint,
  tolerance: bigint = ONE / 10_000n,
) {
  const delta = actual > expected ? actual - expected : expected - actual;
  expect(delta).to.be.lte(tolerance);
}

describe("AaveV3Strategy (forked Celo mainnet)", () => {
  it(
    "deposits to and withdraws from the real Aave pool",
    async () => {
      const { strategy, cUSD, vaultSigner } = await deployStrategyFixture();
      const strategyAddress = await strategy.getAddress();

      const depositAmount = 60n * ONE;
      await cUSD.connect(vaultSigner).approve(strategyAddress, depositAmount);

      const vaultBalanceBefore = await cUSD.balanceOf(vaultSigner.address);
      await strategy.connect(vaultSigner).deposit(depositAmount);
      const vaultBalanceAfter = await cUSD.balanceOf(vaultSigner.address);
      expect(vaultBalanceBefore - vaultBalanceAfter).to.equal(depositAmount);

      const strategyAssetsAfterDeposit = await strategy.totalAssets();
      expectApproxEqual(strategyAssetsAfterDeposit, depositAmount);

      const reserve = await strategy.getReserveData();
      expect(reserve.liquidityRate).to.be.gt(0);

      const withdrawAmount = 20n * ONE;
      await strategy.connect(vaultSigner).withdraw(withdrawAmount);

      const vaultBalancePostWithdraw = await cUSD.balanceOf(
        vaultSigner.address,
      );
      expect(vaultBalancePostWithdraw).to.equal(
        vaultBalanceAfter + withdrawAmount,
      );

      const remainingAssets = await strategy.totalAssets();
      expectApproxEqual(remainingAssets, depositAmount - withdrawAmount);

      await strategy.connect(vaultSigner).withdrawAll();
      const finalAssets = await strategy.totalAssets();
      expect(finalAssets).to.be.lte(ONE / 10_000n);
    },
    { timeout: 300_000 },
  );

  it(
    "yields additional assets after time elapses",
    async () => {
      const { strategy, cUSD, vaultSigner, testClient } =
        await deployStrategyFixture();
      const strategyAddress = await strategy.getAddress();

      const depositAmount = 60n * ONE;
      await cUSD.connect(vaultSigner).approve(strategyAddress, depositAmount);

      const vaultBalanceBefore = await cUSD.balanceOf(vaultSigner.address);
      await strategy.connect(vaultSigner).deposit(depositAmount);

      const initialAssets = await strategy.totalAssets();
      expectApproxEqual(initialAssets, depositAmount);

      await testClient.increaseTime({
        seconds: 30n * 24n * 60n * 60n,
      });
      await testClient.mine({ blocks: 1n });

      const assetsAfter = await strategy.totalAssets();
      expect(assetsAfter).to.be.gt(initialAssets);

      await strategy.connect(vaultSigner).withdrawAll();
      const vaultBalanceAfter = await cUSD.balanceOf(vaultSigner.address);
      expect(vaultBalanceAfter).to.be.gt(vaultBalanceBefore);
    },
    { timeout: 300_000 },
  );
});


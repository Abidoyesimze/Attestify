import { describe, it } from "node:test";
import { expect } from "chai";
import { network } from "hardhat";
import { encodeFunctionData, parseEther, formatEther } from "viem";
import { Contract } from "ethers";

describe("AttestifyVault End-to-End (Forked Mainnet)", async () => {
  const { viem } = await network.connect();
  const wallets = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  const testClient = await viem.getTestClient();
  const [deployer, alice] = wallets;
  const ONE = 10n ** 18n;

  // Real Celo mainnet addresses
  const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";
  const ACUSD_ADDRESS = "0xBba98352628B0B0c4b40583F593fFCb630935a45";
  const AAVE_POOL_ADDRESSES_PROVIDER = "0x9F7Cf9417D5251C59fE94fB9147feEe1aAd9Cea5";
  const CUSD_WHALE = "0x918146359264C492BD6934071c6Bd31C854EDBc3"; // Mento reserve

  const ERC20_ABI = [
    {
      name: "balanceOf",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ type: "uint256" }],
    },
    {
      name: "transfer",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "to", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ type: "bool" }],
    },
    {
      name: "approve",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "spender", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ type: "bool" }],
    },
    {
      name: "allowance",
      type: "function",
      stateMutability: "view",
      inputs: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
      ],
      outputs: [{ type: "uint256" }],
    },
  ] as const;

  async function deployEndToEndFixture() {
    const { ethers } = await network.connect();
    
    // Deploy verifier
    const verifier = await viem.deployContract(
      "contracts/mocks/MockVerifier.sol:MockVerifier",
    );

    // Deploy AaveV3Strategy with real addresses
    const strategy = await viem.deployContract(
      "contracts/AaveV3Strategy.sol:AaveV3Strategy",
      [CUSD_ADDRESS, ACUSD_ADDRESS, AAVE_POOL_ADDRESSES_PROVIDER],
    );

    // Deploy vault implementation
    const vaultImpl = await viem.deployContract(
      "contracts/AttestifyVault.sol:AttestifyVault",
    );

    const maxUser = 1_000_000n * ONE;
    const maxTotal = 10_000_000n * ONE;

    const initCalldata = encodeFunctionData({
      abi: vaultImpl.abi,
      functionName: "initialize",
      args: [CUSD_ADDRESS, strategy.address, verifier.address, maxUser, maxTotal],
    });

    const proxy = await viem.deployContract(
      "contracts/mocks/TestProxy.sol:TestProxy",
      [vaultImpl.address, initCalldata],
    );

    const vault = await viem.getContractAt(
      "contracts/AttestifyVault.sol:AttestifyVault",
      proxy.address,
    );

    // Set vault on strategy
    await strategy.write.setVault([vault.address], { account: deployer.account });

    // Fund alice with cUSD from whale using ethers (same pattern as AaveV3StrategyFork test)
    const testClient = await viem.getTestClient();
    const cUSD = new Contract(CUSD_ADDRESS, ERC20_ABI, ethers.provider);
    
    // Impersonate whale
    await testClient.impersonateAccount({ address: CUSD_WHALE });
    await testClient.setBalance({
      address: CUSD_WHALE,
      value: parseEther("100"),
    });
    await ethers.provider.send("hardhat_impersonateAccount", [CUSD_WHALE]);
    await ethers.provider.send("hardhat_setBalance", [
      CUSD_WHALE,
      "0x56BC75E2D63100000", // 100 CELO
    ]);

    const fundingAmount = parseEther("10000");
    const whaleSigner = await ethers.getSigner(CUSD_WHALE);
    const transferTx = await cUSD.connect(whaleSigner).transfer(alice.account.address, fundingAmount);
    const transferReceipt = await transferTx.wait();
    
    // Verify transfer succeeded
    if (transferReceipt?.status !== 1) {
      throw new Error("Funding transfer failed");
    }

    await testClient.stopImpersonatingAccount({ address: CUSD_WHALE });
    await ethers.provider.send("hardhat_stopImpersonatingAccount", [CUSD_WHALE]);

    return { vault, strategy, verifier, cUSD };
  }

  it("complete user journey: verify → deposit → yield accrual → withdraw with returns", async () => {
    const { vault, strategy, verifier, cUSD } = await deployEndToEndFixture();
    const { ethers, viem } = await network.connect();
    const testClient = await viem.getTestClient();

    // Get signer for ethers operations (cUSD)
    const aliceSigner = await ethers.getSigner(alice.account.address);

    console.log("\n📋 Starting End-to-End Test Flow");
    console.log("=" .repeat(60));

    // Step 1: Verify user (use viem for verifier since it was deployed with viem)
    console.log("\n1️⃣ Verifying user (Alice)...");
    await verifier.write.setVerified([alice.account.address, true], {
      account: deployer.account,
    });
    const isVerified = await verifier.read.isVerified([alice.account.address]);
    expect(isVerified).to.be.true;
    console.log("   ✅ Alice is now verified");

    // Step 2: Check initial balances
    console.log("\n2️⃣ Checking initial balances...");
    const initialCusdBalance = await cUSD.balanceOf(alice.account.address);
    console.log(`   Alice cUSD: ${formatEther(initialCusdBalance)}`);
    expect(initialCusdBalance).to.be.greaterThan(0n);

    // Step 3: Deposit to vault
    console.log("\n3️⃣ Alice deposits to vault...");
    const depositAmount = parseEther("1000");
    
    // Use viem for approval (consistent with deposit)
    const publicClient = await viem.getPublicClient();
    const approveAmount = depositAmount * 2n;
    const approveHash = await alice.writeContract({
      address: CUSD_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [vault.address, approveAmount],
    });
    await publicClient.waitForTransactionReceipt({ hash: approveHash });
    console.log(`   ✅ Approval transaction confirmed`);
    
    // Check balance before
    const aliceBalanceBefore = await cUSD.balanceOf(alice.account.address);
    console.log(`   Alice balance before deposit: ${formatEther(aliceBalanceBefore)} cUSD`);
    console.log(`   Deposit amount: ${formatEther(depositAmount)} cUSD`);
    
    // Verify sufficient balance
    if (aliceBalanceBefore < depositAmount) {
      throw new Error(`Insufficient balance: ${formatEther(aliceBalanceBefore)} < ${formatEther(depositAmount)}`);
    }
    
    // Deposit using viem (vault was deployed with viem)
    const depositHash = await vault.write.deposit([depositAmount], {
      account: alice.account,
    });
    const depositReceipt = await publicClient.waitForTransactionReceipt({ hash: depositHash });
    console.log(`   ✅ Deposit transaction: ${depositHash}`);
    console.log(`   Status: ${depositReceipt.status}`);
    
    // Check balance after
    const aliceBalanceAfter = await cUSD.balanceOf(alice.account.address);
    console.log(`   Alice balance after deposit: ${formatEther(aliceBalanceAfter)} cUSD`);
    
    // Verify funds were transferred
    const balanceDiff = aliceBalanceBefore - aliceBalanceAfter;
    console.log(`   Balance difference: ${formatEther(balanceDiff)} cUSD`);
    
    if (balanceDiff === 0n) {
      throw new Error("Deposit transaction succeeded but no funds were transferred. Check deposit function execution.");
    }
    
    // Check vault state using viem (consistent with deployment)
    const vaultTotalAssets = await vault.read.totalAssets();
    const aliceVaultBalance = await vault.read.balanceOf([alice.account.address]);
    console.log(`   Vault total assets: ${formatEther(vaultTotalAssets)} cUSD`);
    console.log(`   Alice vault balance: ${formatEther(aliceVaultBalance)} cUSD`);
    
    // If no event and no balance change, the deposit likely reverted silently
    if (!depositedEvent && balanceDiff === 0n && vaultTotalAssets === 0n) {
      throw new Error("Deposit transaction succeeded but no funds were transferred, no event was emitted, and vault state is unchanged. The deposit likely reverted silently.");
    }
    
    // If vault state shows the deposit, but balance didn't change, there might be a state sync issue
    if (vaultTotalAssets > 0n && balanceDiff === 0n) {
      console.log(`   ⚠️  Warning: Vault shows assets but balance didn't change. Possible state sync issue.`);
    }
    
    expect(balanceDiff).to.equal(depositAmount);

    // Get shares for logging
    const aliceShares = await vault.read.shares([alice.account.address]);
    console.log(`   Alice shares: ${formatEther(aliceShares)}`);

    // Verify funds are in strategy (Aave)
    const strategyBalance = await strategy.read.totalAssets();
    console.log(`   Strategy (Aave) balance: ${formatEther(strategyBalance)} cUSD`);
    expect(strategyBalance).to.be.greaterThan(0n);

    // Step 4: Time passes - yield accrues
    console.log("\n4️⃣ Simulating time passage for yield accrual...");
    const daysToAdvance = 30n;
    const secondsIn30Days = daysToAdvance * 24n * 60n * 60n;
    
    await testClient.increaseTime({ seconds: secondsIn30Days });
    await testClient.mine({ blocks: 1n });
    console.log(`   ✅ Advanced ${daysToAdvance} days`);

    // Check that strategy balance has increased (yield accrued)
    const strategyBalanceAfterTime = await strategy.read.totalAssets();
    const yieldAccrued = strategyBalanceAfterTime - strategyBalance;
    console.log(`   Strategy balance after ${daysToAdvance} days: ${formatEther(strategyBalanceAfterTime)} cUSD`);
    console.log(`   Yield accrued: ${formatEther(yieldAccrued)} cUSD`);
    
    // Yield should be positive (Aave interest accrues continuously)
    expect(strategyBalanceAfterTime).to.be.greaterThanOrEqual(strategyBalance);

    // Step 5: Check vault total assets increased
    const vaultTotalAssetsAfterTime = await vault.read.totalAssets();
    const vaultYield = vaultTotalAssetsAfterTime - vaultTotalAssets;
    console.log(`   Vault total assets after yield: ${formatEther(vaultTotalAssetsAfterTime)} cUSD`);
    console.log(`   Vault yield: ${formatEther(vaultYield)} cUSD`);

    // Step 6: Alice's vault balance should reflect yield
    const aliceVaultBalanceAfterTime = await vault.read.balanceOf([alice.account.address]);
    const aliceYield = aliceVaultBalanceAfterTime - aliceVaultBalance;
    console.log(`   Alice vault balance after yield: ${formatEther(aliceVaultBalanceAfterTime)} cUSD`);
    console.log(`   Alice yield: ${formatEther(aliceYield)} cUSD`);
    
    // Alice should have earned yield
    expect(aliceVaultBalanceAfterTime).to.be.greaterThan(aliceVaultBalance);

    // Step 7: Withdraw and verify yield returns
    console.log("\n5️⃣ Alice withdraws with yield returns...");
    const aliceCusdBeforeWithdraw = await cUSD.balanceOf(alice.account.address);
    
    // Withdraw all using viem
    const withdrawHash = await vault.write.withdrawAll({
      account: alice.account,
    });
    await publicClient.waitForTransactionReceipt({ hash: withdrawHash });
    console.log(`   ✅ Withdrawn all funds`);

    const aliceCusdAfterWithdraw = await cUSD.balanceOf(alice.account.address);
    const totalReceived = aliceCusdAfterWithdraw - aliceCusdBeforeWithdraw;
    const netYield = totalReceived - depositAmount;

    console.log(`   Alice received: ${formatEther(totalReceived)} cUSD`);
    console.log(`   Original deposit: ${formatEther(depositAmount)} cUSD`);
    console.log(`   Net yield earned: ${formatEther(netYield)} cUSD`);

    // Verify Alice received more than she deposited (yield returns)
    expect(totalReceived).to.be.greaterThan(depositAmount);
    expect(netYield).to.be.greaterThan(0n);

    // Step 8: Verify vault is empty
    const finalVaultBalance = await vault.read.totalAssets();
    const finalAliceVaultBalance = await vault.read.balanceOf([alice.account.address]);
    const finalAliceShares = await vault.read.shares([alice.account.address]);

    console.log("\n6️⃣ Final state verification...");
    console.log(`   Vault total assets: ${formatEther(finalVaultBalance)} cUSD`);
    console.log(`   Alice vault balance: ${formatEther(finalAliceVaultBalance)} cUSD`);
    console.log(`   Alice shares: ${formatEther(finalAliceShares)}`);

    expect(finalAliceVaultBalance).to.equal(0n);
    expect(finalAliceShares).to.equal(0n);

    // Step 9: Check earnings tracking
    const aliceEarnings = await vault.read.getEarnings([alice.account.address]);
    console.log(`   Alice total earnings tracked: ${formatEther(aliceEarnings)} cUSD`);
    expect(aliceEarnings).to.be.greaterThan(0n);

    console.log("\n" + "=".repeat(60));
    console.log("✅ END-TO-END TEST PASSED!");
    console.log("=".repeat(60));
    console.log("\n📊 Summary:");
    console.log(`   ✅ User verified`);
    console.log(`   ✅ Deposited ${formatEther(depositAmount)} cUSD`);
    console.log(`   ✅ Funds deployed to real Aave V3`);
    console.log(`   ✅ Yield accrued over ${daysToAdvance} days`);
    console.log(`   ✅ Withdrew ${formatEther(totalReceived)} cUSD`);
    console.log(`   ✅ Earned ${formatEther(netYield)} cUSD in yield`);
    console.log(`   ✅ Yield return confirmed: ${((Number(netYield) / Number(depositAmount)) * 100).toFixed(4)}%`);
  }, { timeout: 120000 });
});


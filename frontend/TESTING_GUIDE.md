# Attestify Dashboard Testing Guide

## 🎯 Quick Start Testing

### Prerequisites
1. **MetaMask** or compatible wallet installed
2. **Celo Sepolia** network added to wallet
3. **Test cUSD** in wallet (get from faucet)
4. **Wallet connected** to Attestify

---

## 🌐 Network Configuration

### Celo Sepolia Testnet
```
Network Name: Celo Sepolia Testnet
RPC URL: https://forno.celo-sepolia.celo-testnet.org
Chain ID: 11142220
Currency Symbol: S-CELO
Block Explorer: https://celo-sepolia.blockscout.com
```

---

## 💰 Get Test Tokens

### cUSD Faucet
1. Visit: https://faucet.celo.org
2. Enter your wallet address
3. Select "Celo Sepolia Testnet"
4. Request cUSD tokens
5. Wait ~30 seconds for tokens to arrive

**Note**: You'll receive approximately 5-10 test cUSD

---

## ✅ Testing Workflow

### 1. **Initial Setup**
```
□ Open application
□ Connect wallet (RainbowKit button)
□ Verify network is Celo Sepolia
□ Check wallet has test cUSD
```

### 2. **Identity Verification** (First Time Only)
```
□ Click "Start Verification"
□ Choose Desktop or Mobile method
□ Complete Self Protocol verification
□ Wait for success message
□ Dashboard should unlock
```

### 3. **First Deposit**
```
Step-by-step:
1. Go to Overview section
2. Check wallet balance is displayed
3. Enter deposit amount (e.g., "15")
4. Click "Deposit" button
5. Approve cUSD in wallet (1st transaction)
6. Wait for approval confirmation
7. Confirm deposit in wallet (2nd transaction)
8. Wait for deposit confirmation
9. Verify balances updated:
   - Wallet balance decreased
   - Vault balance increased
   - Total Balance card shows deposit

Expected Result:
✅ Two wallet popups (approve + deposit)
✅ Button shows "Approving cUSD..." then "Depositing..."
✅ Success message "Deposit Successful!"
✅ Balances update automatically
```

### 4. **Second Deposit** (Already Approved)
```
Step-by-step:
1. Enter another deposit amount (e.g., "20")
2. Click "Deposit" button
3. Confirm deposit in wallet (only 1 transaction)
4. Wait for confirmation
5. Verify balances updated

Expected Result:
✅ Only ONE wallet popup (deposit)
✅ Button shows "Depositing..." directly
✅ Success message appears
✅ Balances update
```

### 5. **Strategy Change**
```
Step-by-step:
1. Click "Strategy" in sidebar
2. Current strategy shown at top (default: Conservative)
3. Click "Select Strategy" on different strategy (e.g., Balanced)
4. Confirm transaction in wallet
5. Wait for confirmation
6. Verify:
   - Success message appears
   - New strategy has green border
   - "Active" badge on new strategy

Expected Result:
✅ One wallet popup
✅ Strategy changes successfully
✅ No fees charged
```

### 6. **Withdraw**
```
Step-by-step:
1. Go back to Overview section
2. Check vault balance
3. Enter withdraw amount (less than balance)
4. Click "Withdraw" button
5. Confirm transaction in wallet
6. Wait for confirmation
7. Verify:
   - Vault balance decreased
   - Wallet cUSD balance increased
   - Earnings still tracked

Expected Result:
✅ One wallet popup
✅ Button shows "Withdrawing..."
✅ Success message appears
✅ Balances update correctly
```

---

## 🧪 Test Cases

### Deposit Validation Tests

#### Test 1: Below Minimum
```
Amount: 5 cUSD
Expected: ❌ Error "Minimum deposit is 10 cUSD"
```

#### Test 2: Above Maximum
```
Amount: 15000 cUSD
Expected: ❌ Error "Maximum deposit is 10,000 cUSD"
```

#### Test 3: Insufficient Balance
```
Amount: 1000000 cUSD (more than you have)
Expected: ❌ Error "Insufficient cUSD balance. You have X cUSD"
```

#### Test 4: Valid Deposit
```
Amount: 15 cUSD
Expected: ✅ Success
```

#### Test 5: Exact Minimum
```
Amount: 10 cUSD
Expected: ✅ Success
```

---

### Withdraw Validation Tests

#### Test 1: More Than Balance
```
Amount: 99999 cUSD
Expected: ❌ Error "Insufficient balance. You have X cUSD"
```

#### Test 2: Valid Withdrawal
```
Amount: 5 cUSD
Expected: ✅ Success
```

#### Test 3: Full Withdrawal
```
Amount: (Your entire balance)
Expected: ✅ Success, balance becomes 0
```

---

### Strategy Tests

#### Test 1: Change to Balanced
```
From: Conservative
To: Balanced
Expected: ✅ Success, allocations update
```

#### Test 2: Same Strategy
```
Try selecting current strategy
Expected: ❌ Error "Already using this strategy"
```

#### Test 3: Change to Growth
```
From: Any
To: Growth
Expected: ✅ Success, shows 80/20 allocation
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Transaction Stuck
**Symptom**: Button shows loading forever
**Solution**: 
- Check MetaMask for pending transactions
- Speed up or cancel stuck transaction
- Refresh page and try again

### Issue 2: Balance Not Updating
**Symptom**: Numbers don't change after transaction
**Solution**:
- Wait 10-15 seconds (auto-refresh interval)
- Refresh the page manually
- Check transaction on block explorer

### Issue 3: Approval Not Working
**Symptom**: Approval transaction fails
**Solution**:
- Check you have enough CELO for gas
- Increase gas limit in MetaMask
- Try approving exact amount again

### Issue 4: Verification Modal Stuck
**Symptom**: QR code doesn't appear
**Solution**:
- Close and reopen modal
- Try mobile method instead
- Clear browser cache
- Check Self Protocol service status

---

## 📊 Expected Behavior Summary

### Balances
| Action | Wallet cUSD | Vault Balance | Total Earnings |
|--------|-------------|---------------|----------------|
| Initial | 100 | 0 | 0 |
| Deposit 50 | 50 | 50 | 0 |
| Wait (earn) | 50 | 50.05 | 0.05 |
| Withdraw 20 | 70 | 30.05 | 0.05 |

### Transaction States Timeline
```
Deposit Flow:
Input → Approving (15s) → Depositing (15s) → Success (3s) → Input

Withdraw Flow:
Input → Withdrawing (15s) → Success (3s) → Input

Strategy Flow:
Input → Changing (15s) → Success (3s) → Input
```

### Gas Costs (Approximate)
- Approve: ~50,000 gas
- Deposit: ~150,000 gas
- Withdraw: ~100,000 gas
- Change Strategy: ~80,000 gas

---

## 🎬 Full User Journey Test

### Complete Flow (20 minutes)
```
1. Connect Wallet (1 min)
   □ Open app
   □ Click "Connect Wallet"
   □ Approve connection

2. Verification (5 min)
   □ Click "Start Verification"
   □ Scan QR code with Self app
   □ Complete verification
   □ See dashboard unlock

3. First Deposit (3 min)
   □ Enter 15 cUSD
   □ Approve cUSD
   □ Confirm deposit
   □ See success

4. Check Stats (1 min)
   □ Verify Total Balance = 15
   □ Check APY = 3.5%
   □ See earnings = 0

5. Change Strategy (2 min)
   □ Go to Strategy section
   □ Select "Balanced"
   □ Confirm transaction
   □ Verify 90/10 allocation

6. Second Deposit (2 min)
   □ Back to Overview
   □ Enter 25 cUSD
   □ Confirm deposit (no approval needed)
   □ Total balance = 40

7. Partial Withdrawal (2 min)
   □ Enter 10 cUSD withdraw
   □ Confirm transaction
   □ Vault balance = 30

8. Check Final State (1 min)
   □ Wallet has increased cUSD
   □ Vault shows 30 cUSD
   □ Strategy is Balanced
   □ Earnings tracked

Total Expected Time: ~17-20 minutes
```

---

## 📸 Screenshot Checklist

Take screenshots at these stages:
1. ✅ Connected wallet (Overview page)
2. ✅ Verification modal (QR code)
3. ✅ First deposit approval popup
4. ✅ Deposit success message
5. ✅ Strategy section with 3 options
6. ✅ Strategy change success
7. ✅ Withdrawal success
8. ✅ Final dashboard with balances

---

## 🔍 Debug Checklist

If something doesn't work:
```
□ Check browser console for errors
□ Verify wallet is on Celo Sepolia network
□ Confirm contract address is correct
□ Check transaction on block explorer
□ Verify cUSD token balance
□ Test with different browser
□ Clear cache and cookies
□ Try incognito mode
```

---

## 📞 Support Resources

- **Contract**: 0x99dBE4AEa58E518C50a1c04aE9b48C9F6354612f
- **Block Explorer**: https://celo-sepolia.blockscout.com
- **Celo Docs**: https://docs.celo.org
- **Self Protocol**: https://docs.self.xyz
- **Celo Discord**: https://discord.com/invite/celo

---

## ✅ Success Criteria

The integration is working correctly if:
- ✅ All deposits execute with proper approvals
- ✅ Withdrawals complete successfully
- ✅ Strategy changes are reflected
- ✅ Balances update automatically
- ✅ Transaction states show correctly
- ✅ Error messages are clear
- ✅ No console errors
- ✅ Gas estimates are reasonable

---

## 🎉 Test Complete!

Once you've verified all features work:
1. ✅ Deposit functionality (with approval flow)
2. ✅ Withdraw functionality
3. ✅ Strategy management
4. ✅ Balance tracking
5. ✅ Error handling
6. ✅ Success feedback
7. ✅ Loading states

**Your Attestify dashboard is ready for production!** 🚀


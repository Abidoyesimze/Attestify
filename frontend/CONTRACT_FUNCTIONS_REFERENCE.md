# AttestifyVault Smart Contract Functions Reference

This document outlines all available functions in the AttestifyVault contract and how to integrate them into the frontend dashboard.

## 📊 Contract Information
- **Address**: `0x99dBE4AEa58E518C50a1c04aE9b48C9F6354612f` (Celo Sepolia Testnet)
- **Network**: Celo Sepolia (Chain ID: 11142220)
- **ABI Location**: `frontend/src/abis/Vault.json`

---

## 🔍 VIEW FUNCTIONS (Read-Only)

### 1. **`isVerified(address user)`**
**Purpose**: Check if a user has completed Self Protocol verification  
**Returns**: `bool` - verification status  
**Current Usage**: ✅ Already integrated in dashboard

```typescript
const { data: isVerified } = useReadContract({
  ...CONTRACT_CONFIG,
  functionName: 'isVerified',
  args: [address],
});
```

---

### 2. **`balanceOf(address user)`**
**Purpose**: Get user's current balance in cUSD (including yield)  
**Returns**: `uint256` - balance in wei (18 decimals)  
**Current Usage**: ✅ Already integrated in dashboard

```typescript
const { data: balance } = useReadContract({
  ...CONTRACT_CONFIG,
  functionName: 'balanceOf',
  args: [address],
});
```

**Display**: Use `formatEther()` to convert to readable format

---

### 3. **`getEarnings(address user)`**
**Purpose**: Get user's total earnings from yield  
**Returns**: `uint256` - earnings in wei  
**Current Usage**: ✅ Already integrated in dashboard

```typescript
const { data: earnings } = useReadContract({
  ...CONTRACT_CONFIG,
  functionName: 'getEarnings',
  args: [address],
});
```

---

### 4. **`getCurrentAPY()`**
**Purpose**: Get current Annual Percentage Yield  
**Returns**: `uint256` - APY in basis points (e.g., 350 = 3.5%)  
**Current Usage**: ✅ Already integrated in dashboard

```typescript
const { data: currentAPY } = useReadContract({
  ...CONTRACT_CONFIG,
  functionName: 'getCurrentAPY',
});
```

**Conversion**: Divide by 100 to get percentage (350 → 3.5%)

---

### 5. **`shares(address user)`**
**Purpose**: Get user's vault shares (internal accounting)  
**Returns**: `uint256` - number of shares  
**Current Usage**: ❌ Not yet integrated

```typescript
const { data: userShares } = useReadContract({
  ...CONTRACT_CONFIG,
  functionName: 'shares',
  args: [address],
});
```

**Use Case**: Display share ownership, calculate user's % of total vault

---

### 6. **`userStrategy(address user)`**
**Purpose**: Get user's current investment strategy  
**Returns**: `uint8` - Strategy enum (0=Conservative, 1=Balanced, 2=Growth)  
**Current Usage**: ❌ Not yet integrated

```typescript
const { data: userStrategy } = useReadContract({
  ...CONTRACT_CONFIG,
  functionName: 'userStrategy',
  args: [address],
});
```

**Use Case**: Display in Strategy section

---

### 7. **`strategies(uint8 strategyType)`**
**Purpose**: Get details of a specific strategy  
**Returns**: Tuple `(string name, uint8 moolaAllocation, uint8 reserveAllocation)`  
**Current Usage**: ❌ Not yet integrated

```typescript
const { data: strategyDetails } = useReadContract({
  ...CONTRACT_CONFIG,
  functionName: 'strategies',
  args: [0], // 0=Conservative, 1=Balanced, 2=Growth
});
```

**Use Case**: Display strategy options with allocations

---

### 8. **`MIN_DEPOSIT()`**
**Purpose**: Get minimum deposit amount  
**Returns**: `uint256` - 10 cUSD (10e18 wei)  
**Current Usage**: ❌ Not yet integrated

```typescript
const { data: minDeposit } = useReadContract({
  ...CONTRACT_CONFIG,
  functionName: 'MIN_DEPOSIT',
});
```

**Use Case**: Input validation for deposit form

---

### 9. **`MAX_DEPOSIT()`**
**Purpose**: Get maximum deposit per transaction  
**Returns**: `uint256` - 10,000 cUSD (10_000e18 wei)  
**Current Usage**: ❌ Not yet integrated

```typescript
const { data: maxDeposit } = useReadContract({
  ...CONTRACT_CONFIG,
  functionName: 'MAX_DEPOSIT',
});
```

**Use Case**: Input validation and display max limit

---

### 10. **`MAX_TVL()`**
**Purpose**: Get maximum Total Value Locked in vault  
**Returns**: `uint256` - 100,000 cUSD (100_000e18 wei)  
**Current Usage**: ❌ Not yet integrated

```typescript
const { data: maxTVL } = useReadContract({
  ...CONTRACT_CONFIG,
  functionName: 'MAX_TVL',
});
```

**Use Case**: Display vault capacity, show remaining deposit space

---

## ✍️ WRITE FUNCTIONS (Transactions)

### 1. **`deposit(uint256 amount)`**
**Purpose**: Deposit cUSD to earn yield  
**Requirements**: 
- User must be verified
- Amount >= MIN_DEPOSIT (10 cUSD)
- Amount <= MAX_DEPOSIT (10,000 cUSD)
- Must approve cUSD token first

**Current Usage**: ❌ Not yet integrated

```typescript
// Step 1: Approve cUSD spending
const { writeContract: approveToken } = useWriteContract();

approveToken({
  address: cUSD_ADDRESS,
  abi: ERC20_ABI,
  functionName: 'approve',
  args: [CONTRACT_ADDRESSES.ATTESTIFY_VAULT, parseEther(amount)],
});

// Step 2: Deposit
const { writeContract: depositFunds } = useWriteContract();

depositFunds({
  ...CONTRACT_CONFIG,
  functionName: 'deposit',
  args: [parseEther(amount)],
});
```

**Events Emitted**: `Deposited(user, amount, shares)`

---

### 2. **`withdraw(uint256 amount)`**
**Purpose**: Withdraw cUSD from vault  
**Requirements**: User must have sufficient shares  
**Current Usage**: ❌ Not yet integrated

```typescript
const { writeContract: withdrawFunds } = useWriteContract();

withdrawFunds({
  ...CONTRACT_CONFIG,
  functionName: 'withdraw',
  args: [parseEther(amount)],
});
```

**Events Emitted**: `Withdrawn(user, amount, shares)`

---

### 3. **`changeStrategy(uint8 strategy)`**
**Purpose**: Change investment strategy  
**Requirements**: User must be verified  
**Parameters**: 
- 0 = Conservative (100% Moola)
- 1 = Balanced (90% Moola, 10% reserve)
- 2 = Growth (80% Moola, 20% reserve)

**Current Usage**: ❌ Not yet integrated

```typescript
const { writeContract: updateStrategy } = useWriteContract();

updateStrategy({
  ...CONTRACT_CONFIG,
  functionName: 'changeStrategy',
  args: [strategyType], // 0, 1, or 2
});
```

**Events Emitted**: `StrategyChanged(user, oldStrategy, newStrategy)`

---

### 4. **`verifyIdentity(bytes proof)`**
**Purpose**: Submit Self Protocol proof for verification  
**Current Usage**: ✅ Handled by Self Protocol SDK  
**Note**: This is automatically called by the SDK, no need for manual integration

---

## 📈 INTEGRATION PRIORITIES

### High Priority (Core Features)
1. ✅ **Deposit Function** - Allow users to deposit cUSD
2. ✅ **Withdraw Function** - Allow users to withdraw funds
3. ✅ **Token Approval** - Approve cUSD spending before deposit
4. ✅ **Min/Max Validation** - Validate deposit amounts

### Medium Priority (Strategy Management)
5. ⏳ **Strategy Display** - Show current strategy
6. ⏳ **Strategy Change** - Allow users to change strategy
7. ⏳ **Strategy Details** - Display all 3 strategies with details

### Low Priority (Analytics)
8. ⏳ **Share Ownership** - Display user's share count
9. ⏳ **TVL Display** - Show vault capacity
10. ⏳ **Historical Data** - Track deposits/withdrawals over time

---

## 🔔 CONTRACT EVENTS

The contract emits these events that we can listen to:

```typescript
// Deposit event
event Deposited(address indexed user, uint256 amount, uint256 shares);

// Withdrawal event  
event Withdrawn(address indexed user, uint256 amount, uint256 shares);

// Verification event
event UserVerified(address indexed user, uint256 timestamp);

// Strategy change event
event StrategyChanged(address indexed user, StrategyType oldStrategy, StrategyType newStrategy);
```

**Use Case**: Show real-time notifications when transactions complete

---

## 💡 NEXT STEPS FOR DASHBOARD INTEGRATION

1. **Deposit/Withdraw Implementation**
   - Create token approval flow
   - Add input validation with MIN/MAX checks
   - Handle transaction states (pending, success, error)
   - Show transaction receipts

2. **Strategy Section**
   - Fetch current user strategy
   - Display all 3 strategy options
   - Add strategy change functionality
   - Show allocation percentages

3. **Analytics Enhancement**
   - Add TVL display
   - Show user's % of vault
   - Historical charts for deposits/earnings

4. **Transaction History**
   - Listen to contract events
   - Display recent deposits/withdrawals
   - Add export functionality

---

## 🛠️ Helper Code Snippets

### cUSD Token Address (Celo Sepolia)
```typescript
const cUSD_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a';
```

### ERC20 Approval ABI
```typescript
const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  }
];
```

### Strategy Type Constants
```typescript
export const STRATEGY_TYPES = {
  CONSERVATIVE: 0,
  BALANCED: 1,
  GROWTH: 2,
} as const;
```

---

## 📝 Status Legend
- ✅ Already Integrated
- ❌ Not Yet Integrated  
- ⏳ In Progress


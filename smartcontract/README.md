# Attestify Smart Contracts 🚀

> AI-powered investment vault with privacy-preserving identity verification

**Built for:** Celo Proof of Ship + Self Protocol Bounty

---

## 🎯 Overview

Attestify is a DeFi savings vault that combines:
- **Identity Verification** (Self Protocol) - Privacy-preserving proof of humanity
- **Automatic Yield** (Moola Market) - Earn interest on deposits
- **AI Recommendations** - Personalized investment strategies
- **Fair Distribution** - Share-based vault system

### How It Works

```
1. User verifies identity via Self Protocol (ZK proof)
   ↓
2. User deposits cUSD to Attestify
   ↓
3. Vault deposits to Moola Market (lending protocol)
   ↓
4. Moola returns mcUSD (interest-bearing token)
   ↓
5. mcUSD automatically earns ~3.5% APY
   ↓
6. User withdraws → Vault redeems mcUSD → User gets cUSD + interest
```

---

## 📁 Contract Architecture

```
contracts/
├── AttestifyVault.sol              # Main vault contract
├── interfaces/
│   ├── ISelfProtocol.sol          # Self Protocol interface
│   └── IMoola.sol                 # Moola Market interface
└── mocks/
    ├── MockToken.sol              # Mock cUSD for testing
    └── MockSelfProtocol.sol       # Mock Self Protocol for testing
```

---

## 🔑 Key Features

### 1. **Identity Verification (Self Protocol)**
- Users verify identity with passport scan
- Zero-knowledge proof submitted on-chain
- No personal data stored
- Only verified users can deposit

### 2. **Automatic Yield Generation (Moola Market)**
- Deposits automatically deployed to Moola
- Earns variable APY (currently ~3.5%)
- Interest compounds continuously
- Withdraw anytime (no lock-up)

### 3. **Share-Based System**
- Fair yield distribution
- Users receive shares proportional to deposit
- Share value increases as yield accrues
- Similar to mutual fund shares

### 4. **Multiple Strategies**
- **Conservative**: 100% Moola, 0% reserve
- **Balanced**: 90% Moola, 10% reserve
- **Growth**: 80% Moola, 20% reserve

---

## 🚀 Deployment

### Prerequisites

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Environment Variables

```bash
# .env
PRIVATE_KEY=your_private_key_here
ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
CELOSCAN_API_KEY=optional_for_verification
```

### Deploy to Alfajores Testnet

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to Alfajores
npm run deploy:alfajores
```

### Contract Addresses (Alfajores)

```solidity
// Attestify
AttestifyVault: [Will be deployed]

// Dependencies
Self Protocol: 0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74
cUSD: 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
mcUSD (Moola): 0x71DB38719f9113A36e14F409bAD4F07B58b4730b
Moola LendingPool: 0x0886f74eEEc443fBb6907fB5528B57C28E813129
```

---

## 🧪 Testing

```bash
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test
npx hardhat test test/AttestifyVault.test.js
```

### Test Coverage

- ✅ Identity verification
- ✅ Deposits and withdrawals
- ✅ Share calculations
- ✅ Moola integration
- ✅ Strategy changes
- ✅ Access control
- ✅ Edge cases

---

## 📊 Contract Details

### AttestifyVault.sol

**Main Functions:**

```solidity
// Identity
function verifyIdentity(bytes calldata proof) external
function isVerified(address user) external view returns (bool)

// Deposits & Withdrawals
function deposit(uint256 assets) external returns (uint256 shares)
function withdraw(uint256 assets) external returns (uint256 shares)

// Views
function balanceOf(address user) external view returns (uint256)
function getEarnings(address user) external view returns (uint256)
function totalAssets() public view returns (uint256)
function getCurrentAPY() external view returns (uint256)

// Strategy
function changeStrategy(StrategyType newStrategy) external

// Admin
function rebalance() external
function setAIAgent(address _aiAgent) external onlyOwner
function pause() external onlyOwner
```

**Key Parameters:**

```solidity
MIN_DEPOSIT = 10 cUSD
MAX_DEPOSIT = 10,000 cUSD per transaction
MAX_TVL = 100,000 cUSD (MVP cap)
RESERVE_RATIO = 10% (kept liquid for withdrawals)
```

---

## 🔐 Security

### Audits
- [ ] OpenZeppelin audit (planned)
- [ ] Bug bounty program (planned)

### Security Features
- ✅ ReentrancyGuard on all state-changing functions
- ✅ Pausable (emergency stop)
- ✅ Access control (Ownable)
- ✅ Input validation
- ✅ Safe ERC20 operations
- ✅ Integer overflow protection (Solidity 0.8+)

### Known Limitations (MVP)
- Single collateral asset (cUSD only)
- Fixed reserve ratio (10%)
- Manual rebalancing
- No governance token




### Key Differentiators

- 🔐 **Privacy-first** - Self Protocol ZK proofs
- 🤖 **AI-powered** - Personalized recommendations
- 💰 **Real yield** - Actual Moola integration
- 📱 **Web-first** - Accessible from any browser
- ✅ **Complete MVP** - Fully functional

---

## 📚 Resources

- **Self Protocol**: https://docs.self.xyz
- **Moola Market**: https://docs.moola.market


---

## 🤝 Contributing

This is a hackathon project. Contributions welcome after initial submission!

---

## 📄 License

MIT License

---

## 👥 Team

Built with ❤️ for Celo 


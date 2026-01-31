# Self Protocol Integration Guide

This document explains how the Self Protocol identity verification is integrated into the Attestify platform using the **official Self Protocol SDK**.

## Overview

Self Protocol provides privacy-preserving identity verification using zero-knowledge proofs. Users can verify their identity without sharing personal information on-chain.

**Implementation**: We use the official [`@selfxyz/qrcode` SDK](https://docs.self.xyz/frontend-integration/qrcode-sdk) for proper bounty eligibility.

## Architecture

### 1. **Self Protocol SDK** (`@selfxyz/qrcode`)
- Official SDK for identity verification
- Provides `SelfQRcodeWrapper` component for QR code generation
- Handles WebSocket communication with Self Protocol backend
- Reference: [QRCode SDK Documentation](https://docs.self.xyz/frontend-integration/qrcode-sdk)

### 2. **Verification Modal** (`src/components/VerificationModal/index.tsx`)
- Main UI component for the verification flow
- Implements both desktop (QR code) and mobile (deeplink) verification
- Uses `SelfAppBuilder` to configure verification requirements
- Integrates `SelfQRcodeWrapper` component from SDK

### 3. **Smart Contract Integration** (`src/abis/index.tsx`)
- Contract ABI with `verifyIdentity` function
- Contract address: `0x99dBE4AEa58E518C50a1c04aE9b48C9F6354612f` (lowercase for SDK)
- Endpoint type: `staging_celo` for Celo Sepolia testnet
- User ID type: `hex` for EVM addresses

## Verification Flow

### Desktop Flow (QR Code)
```
1. User clicks "Verify on Desktop" in modal
   ↓
2. SelfQRcodeWrapper generates QR code
   ↓
3. User scans QR code with Self mobile app
   ↓
4. User completes verification in Self app
   ↓
5. Self Protocol backend verifies proof on-chain
   ↓
6. SDK triggers onSuccess callback
   ↓
7. User is marked as verified
   ↓
8. Dashboard unlocks automatically
```

### Mobile Flow (Deeplink)
```
1. User clicks "Verify on Mobile" in modal
   ↓
2. App generates universal link via getUniversalLink()
   ↓
3. Self app opens directly on mobile device
   ↓
4. User completes verification in Self app
   ↓
5. Self Protocol backend verifies proof on-chain
   ↓
6. User returns to web app
   ↓
7. SDK triggers onSuccess callback
   ↓
8. Dashboard unlocks automatically
```

## Farcaster Mini App / Mobile Integration

When verification runs inside a **Farcaster mini app** (or any in-app browser), use the **mobile-first** flow with deeplinking so users don’t have to scan a QR on the same device.

### How it works

1. **Deeplink**: The app builds a Self universal link with `getUniversalLink(selfApp)` and opens it when the user taps “Verify on Mobile”. The Self app opens directly (no QR scan).
2. **Return URL**: `deeplinkCallback` is set so after verification the Self app redirects the user back to your app (e.g. your mini app URL). Self shows a short countdown and then opens the callback URL.
3. **Contract**: The vault address is passed as `endpoint` (lowercase) with `endpointType: 'staging_celo'` so the Self app can submit the proof on-chain to `AttestifyVault`.

### Configuration for mini app

Set the callback URL so Self redirects back to your Farcaster frame or mini app:

```bash
# Optional: URL where Self app redirects after verification (default: current page URL)
NEXT_PUBLIC_SELF_DEEPLINK_CALLBACK=https://your-mini-app-url.com/verify

# Optional: Self endpoint type (default: staging_celo)
NEXT_PUBLIC_SELF_ENDPOINT_TYPE=staging_celo
```

If `NEXT_PUBLIC_SELF_DEEPLINK_CALLBACK` is not set, the modal uses `window.location.origin + pathname` so users return to the same page (works for same-domain mini apps).

### UI behavior

- **Small screens**: “Verify on Mobile” is shown first (best for Farcaster in-app browser).
- **Large screens**: “Verify on Desktop” is shown first (QR code flow).

Reference: [Self docs – Use deeplinking](https://docs.self.xyz/use-self/use-deeplinking), [QRCode SDK – Usage (Mobile)](https://docs.self.xyz/frontend-integration/qrcode-sdk).

### Native mobile app (React Native)

For a **native** app (e.g. React Native) that runs passport/NFC inside the app, use the **Mobile SDK** (`@selfxyz/mobile-sdk-alpha`): `SelfClientProvider`, onboarding screens (country picker → document camera → NFC), and adapters (auth, scanner, network, crypto, documents). See [Self Mobile SDK – Getting Started](https://docs.self.xyz/mobile-sdk/getting-started) and [SelfClient Provider](https://docs.self.xyz/mobile-sdk/selfclient-provider). The web-based flow above is for **web/mini app** (QR + deeplink); the Mobile SDK is for embedding the full verification flow inside a native app.

## Key Features

### Security
- **Origin Validation**: Only accepts messages from trusted Self Protocol domains
- **Proof Validation**: Validates proof format before submission
- **Error Handling**: Comprehensive error handling at each step

### User Experience
- **Popup Flow**: Non-intrusive verification in separate window
- **Progress Tracking**: Clear visual feedback at each step
- **Transaction Monitoring**: Real-time transaction status updates
- **Explorer Links**: Direct links to view transactions on Celo Explorer

### Production Ready
- No mock data or simulation code
- Proper cleanup of event listeners
- Window state management
- Error recovery options

## Configuration

### Environment Variables
Create `.env.local` file:

```bash
# Self Protocol Configuration
NEXT_PUBLIC_SELF_APP_NAME=Attestify
NEXT_PUBLIC_SELF_SCOPE=attestify

# Optional: Where Self app redirects after verification (mobile / Farcaster mini app)
# Default: current page URL (origin + pathname)
# NEXT_PUBLIC_SELF_DEEPLINK_CALLBACK=https://your-mini-app.com/verify

# Optional: Self endpoint type (staging_celo | production_celo). Default: staging_celo
# NEXT_PUBLIC_SELF_ENDPOINT_TYPE=staging_celo

# WalletConnect Project ID for RainbowKit
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Self Protocol SDK Configuration
The SDK is configured in `VerificationModal/index.tsx` using `SelfAppBuilder`:

```typescript
const app = new SelfAppBuilder({
  version: 2,
  appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || 'Attestify',
  scope: process.env.NEXT_PUBLIC_SELF_SCOPE || 'attestify',
  endpoint: CONTRACT_ADDRESSES.ATTESTIFY_VAULT.toLowerCase(), // must be lowercase
  endpointType: process.env.NEXT_PUBLIC_SELF_ENDPOINT_TYPE || 'staging_celo',
  deeplinkCallback: process.env.NEXT_PUBLIC_SELF_DEEPLINK_CALLBACK || window.location.origin + pathname, // mobile / mini app return
  userIdType: 'hex', // EVM address type
  disclosures: {
    minimumAge: 18,
    excludedCountries: [countries.CUBA, countries.IRAN, countries.NORTH_KOREA, countries.RUSSIA],
    nationality: true,
  },
}).build();
```

## Smart Contract

### Contract: AttestifyVault
**Address**: `0x99dBE4AEa58E518C50a1c04aE9b48C9F6354612f`

### Function: verifyIdentity
```solidity
function verifyIdentity(bytes calldata proof) external;
```

This function:
1. Accepts a zero-knowledge proof from Self Protocol
2. Verifies the proof against the configured Self Protocol instance
3. Marks the user as verified on-chain
4. Emits an `IdentityVerified` event

### View Function: isVerified
```solidity
function isVerified(address user) external view returns (bool);
```

Checks if a user has been verified.

## Testing

### Testnet
- Network: Celo Sepolia
- Chain ID: 11142220
- Explorer: https://celo-sepolia.blockscout.com

### Test Flow
1. Connect wallet with testnet cUSD
2. Click "Start Verification" in dashboard
3. Complete Self Protocol verification in popup
4. Approve transaction (requires gas)
5. Wait for confirmation
6. Verify status updates automatically

## Troubleshooting

### Popup Blocked
**Issue**: Popup window doesn't open  
**Solution**: Enable popups for the site in browser settings

### Message Not Received
**Issue**: Verification complete but proof not submitted  
**Solution**: Check browser console for origin validation errors

### Transaction Failed
**Issue**: Proof submission transaction fails  
**Solution**: 
- Check wallet has sufficient cUSD for gas
- Verify contract is deployed on correct network
- Check proof format is valid

### Verification Status Not Updating
**Issue**: UI doesn't reflect verified status  
**Solution**: The `isVerified` contract call refetches every 5 seconds. Wait a moment after transaction confirmation.

## API Reference

### buildVerificationUrl(walletAddress: string): string
Constructs the Self Protocol verification URL with all required parameters.

### isValidSelfProtocolOrigin(origin: string): boolean
Validates if a postMessage origin is from a trusted Self Protocol domain.

### getPopupFeatures(): string
Returns formatted window.open features string for the verification popup.

## Production Checklist

- [x] Remove all mock/simulation code
- [x] Implement real Self Protocol API integration
- [x] Add origin validation for security
- [x] Implement proper error handling
- [x] Add transaction monitoring
- [x] Add cleanup on unmount
- [x] Document integration flow
- [x] Add user-friendly error messages
- [x] Implement retry mechanism
- [x] Add explorer links for transparency

## Support

- Self Protocol Docs: https://docs.self.id
- Attestify Docs: [Add your docs link]
- Contract Source: `/smartcontract/contracts/AttestifyVault.sol`

## License

MIT


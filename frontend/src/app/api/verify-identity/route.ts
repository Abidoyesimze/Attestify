import { NextRequest, NextResponse } from 'next/server';
import { SelfBackendVerifier } from '@selfxyz/core';

// Initialize Self Protocol backend verifier
const verifier = new SelfBackendVerifier({
  // Configuration should match frontend exactly
  disclosures: {
    minimumAge: 18,
    excludedCountries: [
      'CU', // Cuba
      'IR', // Iran  
      'KP', // North Korea
      'RU', // Russia
    ],
    nationality: true,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { address, proofData, contractAddress } = await request.json();

    if (!address || !proofData || !contractAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('🔍 Verifying proof for address:', address);
    console.log('📋 Proof data:', proofData);

    // Verify the proof using Self Protocol backend verifier
    const verificationResult = await verifier.verify(proofData);

    if (!verificationResult.isValid) {
      console.log('❌ Proof verification failed:', verificationResult.error);
      return NextResponse.json(
        { error: 'Proof verification failed', details: verificationResult.error },
        { status: 400 }
      );
    }

    console.log('✅ Proof verification successful');

    // TODO: Call smart contract to mark user as verified
    // This would require setting up ethers.js or viem to interact with the contract
    // For now, we'll just return success
    
    // Example contract call (commented out):
    // const contract = new ethers.Contract(contractAddress, contractABI, provider);
    // await contract.verifyUser(address);

    return NextResponse.json({
      success: true,
      message: 'Identity verified successfully',
      address,
    });

  } catch (error) {
    console.error('❌ Backend verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

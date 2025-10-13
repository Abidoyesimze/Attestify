import { BrianSDK } from '@brian-ai/sdk';

// Initialize Brian AI SDK
export const brianAI = new BrianSDK({
  apiKey: process.env.NEXT_PUBLIC_BRIAN_API_KEY || '',
});

export interface TransactionIntent {
  action: 'deposit' | 'withdraw' | 'swap' | 'transfer' | 'unknown';
  amount?: string;
  token?: string;
  data?: unknown;
}

/**
 * Extract transaction intent from natural language
 */
export async function extractIntent(
  prompt: string
): Promise<TransactionIntent | null> {
  try {
    if (!process.env.NEXT_PUBLIC_BRIAN_API_KEY) {
      console.warn('Brian AI API key not configured');
      return null;
    }

    const result = await brianAI.extract({
      prompt,
    });

    // Handle the actual return type from Brian SDK
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultData = result as any;
    
    return {
      action: resultData.action || 'unknown',
      amount: resultData.amount,
      token: resultData.token,
      data: resultData,
    };
  } catch (error) {
    console.error('Brian AI extract error:', error);
    return null;
  }
}

/**
 * Get AI-powered recommendations based on user's portfolio
 */
export async function getRecommendation(
  userAddress: string,
  context: {
    vaultBalance: string;
    currentAPY: string;
    strategy: string;
    earnings: string;
  }
): Promise<string> {
  try {
    if (!process.env.NEXT_PUBLIC_BRIAN_API_KEY) {
      return "Brian AI is not configured. Please add your API key to use AI recommendations.";
    }

    const prompt = `
      I'm using a DeFi yield vault on Celo called Attestify. Here's my current situation:
      - Vault Balance: ${context.vaultBalance} cUSD
      - Current APY: ${context.currentAPY}%
      - Strategy: ${context.strategy}
      - Total Earnings: ${context.earnings} cUSD
      
      What strategies would you recommend to optimize my yield? Should I change my allocation?
    `;

    const response = await brianAI.ask({
      prompt,
      kb: 'celo',
    });

    return response.answer || 'Unable to generate recommendations at this time.';
  } catch (error) {
    console.error('Brian AI ask error:', error);
    return 'Unable to generate recommendations. Please try again later.';
  }
}

/**
 * Explain what a transaction will do before execution
 */
export async function explainTransaction(
  action: string,
  amount: string,
  token: string = 'cUSD'
): Promise<string> {
  try {
    if (!process.env.NEXT_PUBLIC_BRIAN_API_KEY) {
      return `This will ${action} ${amount} ${token}.`;
    }

    const prompt = `Explain in simple terms what happens when I ${action} ${amount} ${token} to/from the Attestify vault on Celo. Keep it brief and clear.`;

    const response = await brianAI.ask({
      prompt,
      kb: 'celo',
    });

    return response.answer || `This will ${action} ${amount} ${token}.`;
  } catch (error) {
    console.error('Brian AI explain error:', error);
    return `This will ${action} ${amount} ${token}.`;
  }
}

/**
 * Analyze user's DeFi strategy and provide insights
 */
export async function analyzeStrategy(
  userAddress: string,
  strategyType: 'Conservative' | 'Balanced' | 'Growth',
  context: {
    timeInVault: string;
    totalDeposited: string;
    totalEarnings: string;
    currentAPY: string;
  }
): Promise<string> {
  try {
    if (!process.env.NEXT_PUBLIC_BRIAN_API_KEY) {
      return `Your ${strategyType} strategy has been active for ${context.timeInVault}.`;
    }

    const prompt = `
      Analyze my DeFi investment strategy:
      - Strategy: ${strategyType}
      - Time in vault: ${context.timeInVault}
      - Total deposited: ${context.totalDeposited} cUSD
      - Total earnings: ${context.totalEarnings} cUSD
      - Current APY: ${context.currentAPY}%
      
      Is this strategy performing well? Should I consider switching?
    `;

    const response = await brianAI.ask({
      prompt,
      kb: 'celo',
    });

    return response.answer || 'Strategy analysis unavailable.';
  } catch (error) {
    console.error('Brian AI strategy analysis error:', error);
    return 'Unable to analyze strategy at this time.';
  }
}

/**
 * Get market insights for Celo DeFi
 */
export async function getMarketInsights(): Promise<string> {
  try {
    if (!process.env.NEXT_PUBLIC_BRIAN_API_KEY) {
      return "Market insights require Brian AI API key configuration.";
    }

    const prompt = `What are the current best yield opportunities for cUSD stablecoins on Celo? What's the market sentiment?`;

    const response = await brianAI.ask({
      prompt,
      kb: 'celo',
    });

    return response.answer || 'Market insights unavailable.';
  } catch (error) {
    console.error('Brian AI market insights error:', error);
    return 'Unable to fetch market insights.';
  }
}

/**
 * Answer general DeFi questions
 */
export async function askQuestion(
  question: string,
  userAddress: string,
  context?: string
): Promise<string> {
  try {
    if (!process.env.NEXT_PUBLIC_BRIAN_API_KEY) {
      return "Please configure Brian AI API key to use the AI assistant.";
    }

    const fullPrompt = context 
      ? `${context}\n\nUser question: ${question}`
      : question;

    const response = await brianAI.ask({
      prompt: fullPrompt,
      kb: 'celo',
    });

    return response.answer || 'I apologize, but I couldn\'t process your question. Please try rephrasing.';
  } catch (error) {
    console.error('Brian AI ask error:', error);
    return 'I encountered an error processing your question. Please try again.';
  }
}

/**
 * Check if Brian AI is properly configured
 */
export function isBrianAIConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_BRIAN_API_KEY;
}


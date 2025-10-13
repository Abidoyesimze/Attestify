# AI Agent Integration Guide for Attestify

## 🎯 Recommended: Brian AI Integration

Brian AI is the best choice for Attestify because it's built specifically for DeFi and can understand natural language commands for on-chain operations.

---

## 🚀 Quick Setup

### 1. Install Brian AI SDK

```bash
cd /home/simze/web3-project/Attestify/frontend
npm install @brian-ai/sdk
```

### 2. Get API Key

1. Visit: https://brianknows.org
2. Sign up for developer account
3. Get your API key
4. Add to `.env.local`:

```env
NEXT_PUBLIC_BRIAN_API_KEY=your_api_key_here
```

---

## 💻 Implementation

### Create AI Service

**File: `frontend/src/services/brianAI.ts`**

```typescript
import { BrianSDK } from '@brian-ai/sdk';

export const brianAI = new BrianSDK({
  apiKey: process.env.NEXT_PUBLIC_BRIAN_API_KEY!,
});

// Extract transaction intent from natural language
export async function extractIntent(prompt: string, address: string) {
  try {
    const result = await brianAI.extract({
      prompt,
      address,
      // Optional: specify supported actions
      actions: ['deposit', 'withdraw', 'swap', 'transfer'],
    });
    
    return result;
  } catch (error) {
    console.error('Brian AI error:', error);
    return null;
  }
}

// Get AI-powered recommendations
export async function getRecommendation(
  userAddress: string,
  vaultBalance: string,
  currentAPY: string
) {
  const prompt = `
    I have ${vaultBalance} cUSD deposited in a vault earning ${currentAPY}% APY.
    What strategies would you recommend to optimize my yield on Celo?
  `;
  
  try {
    const response = await brianAI.ask({
      prompt,
      address: userAddress,
      kb: 'celo-defi', // Knowledge base
    });
    
    return response.answer;
  } catch (error) {
    console.error('Brian AI error:', error);
    return 'Unable to get recommendations at this time.';
  }
}

// Explain transaction before execution
export async function explainTransaction(
  action: string,
  amount: string,
  address: string
) {
  const prompt = `Explain what happens when I ${action} ${amount} cUSD to/from the vault`;
  
  const response = await brianAI.ask({
    prompt,
    address,
  });
  
  return response.answer;
}
```

---

## 🎨 Update Chat Component

**File: `frontend/src/components/AIChat/index.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Bot, Send, Loader2, TrendingUp } from 'lucide-react';
import { extractIntent, getRecommendation } from '@/services/brianAI';
import { parseEther } from 'viem';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChat({ 
  vaultBalance, 
  currentAPY,
  onDeposit,
  onWithdraw,
  onStrategyChange 
}: {
  vaultBalance: string;
  currentAPY: string;
  onDeposit: (amount: string) => void;
  onWithdraw: (amount: string) => void;
  onStrategyChange: (strategy: number) => void;
}) {
  const { address } = useAccount();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI DeFi assistant. I can help you manage your vault, analyze strategies, and optimize your yield. What would you like to do?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !address) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Extract intent using Brian AI
      const intent = await extractIntent(input, address);

      let response = '';

      // Handle different intents
      if (intent?.action === 'deposit') {
        response = `I'll help you deposit ${intent.amount} cUSD. Click the button below to confirm.`;
        // Trigger deposit
        onDeposit(intent.amount);
      } else if (intent?.action === 'withdraw') {
        response = `I'll help you withdraw ${intent.amount} cUSD. Click the button below to confirm.`;
        // Trigger withdrawal
        onWithdraw(intent.amount);
      } else if (input.toLowerCase().includes('strategy')) {
        response = `Based on your current balance of ${vaultBalance} cUSD and ${currentAPY}% APY, here are my recommendations:\n\n• **Conservative**: Best for capital preservation\n• **Balanced**: Good risk/reward ratio\n• **Growth**: Maximum yield potential\n\nWhich would you prefer?`;
      } else if (input.toLowerCase().includes('recommend') || input.toLowerCase().includes('advice')) {
        response = await getRecommendation(address, vaultBalance, currentAPY);
      } else {
        // General query
        response = await getRecommendation(address, input, currentAPY);
      }

      // Add AI response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="h-8 w-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-2xl rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-60 mt-2 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your vault..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        
        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setInput('What\'s my current performance?')}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            📊 Performance
          </button>
          <button
            onClick={() => setInput('Should I change my strategy?')}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            🎯 Strategy Advice
          </button>
          <button
            onClick={() => setInput('What are the risks?')}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            ⚠️ Risk Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 Example Queries Users Can Ask

### Portfolio Management
- "Deposit 50 cUSD"
- "Withdraw 25% of my balance"
- "What's my current yield?"
- "Show me my earnings this week"

### Strategy & Recommendations
- "Should I change my strategy?"
- "What's the best strategy for me?"
- "Compare Conservative vs Growth"
- "Is this a good time to deposit?"

### Risk & Analysis
- "What are the risks of Growth strategy?"
- "Is my vault safe?"
- "What happens if Moola APY drops?"
- "Explain the Balanced strategy"

### Market Insights
- "What's the best APY on Celo right now?"
- "How does Attestify compare to other vaults?"
- "What are the Moola Market risks?"
- "Should I diversify?"

---

## 🔧 Advanced Features

### Auto-Execute Transactions

```typescript
// Add transaction execution capability
const executeIntent = async (intent: any) => {
  switch (intent.action) {
    case 'deposit':
      return await handleDeposit(parseEther(intent.amount));
    
    case 'withdraw':
      return await handleWithdraw(parseEther(intent.amount));
    
    case 'swap':
      // Integrate with DEX
      return await handleSwap(intent.fromToken, intent.toToken, intent.amount);
    
    default:
      return null;
  }
};
```

### Scheduled Actions

```typescript
// Set up recurring deposits
const scheduleDeposit = async (amount: string, frequency: 'daily' | 'weekly' | 'monthly') => {
  // Use Brian AI to understand and schedule
  const intent = await brianAI.extract({
    prompt: `Deposit ${amount} cUSD ${frequency}`,
    address: userAddress,
  });
  
  // Store in database for execution
  await saveScheduledAction(intent);
};
```

### Portfolio Analytics

```typescript
// Get AI-powered insights
const getPortfolioInsights = async () => {
  const analysis = await brianAI.ask({
    prompt: `
      Analyze my DeFi portfolio:
      - Vault Balance: ${vaultBalance} cUSD
      - Current APY: ${currentAPY}%
      - Strategy: ${currentStrategy}
      - Time deposited: ${timeDeposited}
      
      Provide insights and recommendations.
    `,
    address: userAddress,
  });
  
  return analysis;
};
```

---

## 💰 Cost Estimation

### Brian AI Pricing
- **Free Tier**: 100 requests/month
- **Pro**: $49/month (5,000 requests)
- **Enterprise**: Custom pricing

### Recommended for Attestify
Start with **Free Tier** for MVP, upgrade to **Pro** as users grow.

---

## 🎨 UI Integration Points

### 1. Replace Current Chat Section
Update `dashboard/page.tsx` chat section with the new AI Chat component

### 2. Add Quick Actions
```typescript
<button onClick={() => askAI('Deposit 100 cUSD')}>
  💰 Quick Deposit
</button>
```

### 3. Contextual Help
```typescript
<Tooltip content={aiExplanation}>
  <Info className="h-4 w-4" />
</Tooltip>
```

---

## 📊 Analytics & Monitoring

Track AI usage:
```typescript
// Log AI interactions
const logAIInteraction = async (query: string, response: string) => {
  await analytics.track('ai_query', {
    user: address,
    query,
    response,
    timestamp: new Date(),
  });
};
```

---

## 🔒 Security Considerations

1. **Never expose private keys** to AI
2. **Always confirm transactions** in UI before execution
3. **Rate limit** AI requests per user
4. **Validate** all AI-generated transaction parameters
5. **Audit** AI recommendations before execution

---

## 🚀 Next Steps

1. Sign up for Brian AI: https://brianknows.org
2. Install SDK: `npm install @brian-ai/sdk`
3. Create AI service file
4. Update chat component
5. Test with sample queries
6. Monitor usage and optimize

---

## 📚 Resources

- **Brian AI Docs**: https://docs.brianknows.org
- **Brian AI Discord**: https://discord.gg/brianai
- **GitHub Examples**: https://github.com/brian-knows/examples
- **API Reference**: https://docs.brianknows.org/api-reference

---

## 🎯 Success Metrics

Track these to measure AI integration success:
- Number of AI queries per user
- Transaction success rate from AI commands
- User engagement with AI chat
- Reduction in support requests
- Increase in deposits via AI suggestions

---

## ✅ Integration Checklist

- [ ] Sign up for Brian AI account
- [ ] Get API key
- [ ] Install SDK
- [ ] Create AI service file
- [ ] Create AI Chat component
- [ ] Integrate with dashboard
- [ ] Add quick action buttons
- [ ] Test natural language commands
- [ ] Add analytics tracking
- [ ] Deploy and monitor

**Estimated time**: 2-3 hours for basic integration


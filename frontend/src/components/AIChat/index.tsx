'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { Bot, Send, Loader2, TrendingUp, Target, DollarSign, AlertCircle } from 'lucide-react';
import { 
  extractIntent, 
  getRecommendation, 
  analyzeStrategy,
  askQuestion,
  isBrianAIConfigured 
} from '@/services/brianAI';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actionable?: {
    type: 'deposit' | 'withdraw' | 'strategy';
    amount?: string;
    strategy?: number;
  };
}

interface AIChatProps {
  vaultBalance: string;
  currentAPY: string;
  currentStrategy: string;
  earnings: string;
  onDeposit?: (amount: string) => void;
  onWithdraw?: (amount: string) => void;
  onStrategyChange?: (strategy: number) => void;
}

export default function AIChat({ 
  vaultBalance, 
  currentAPY,
  currentStrategy,
  earnings,
  onDeposit,
  onWithdraw,
  onStrategyChange
}: AIChatProps) {
  const { address } = useAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: isBrianAIConfigured() 
        ? `Hi! I'm your AI DeFi assistant powered by Brian AI. 🤖\n\nI can help you:\n• Manage your vault (deposits & withdrawals)\n• Analyze your investment strategy\n• Get market insights and recommendations\n• Answer DeFi questions\n\nWhat would you like to know?`
        : `Hi! I'm your AI DeFi assistant. ⚠️\n\nBrian AI is not configured yet. To enable AI features:\n1. Get an API key from https://brianknows.org\n2. Add NEXT_PUBLIC_BRIAN_API_KEY to your .env.local\n\nFor now, I can provide basic information about your vault.`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !address || isLoading) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      let response = '';
      let actionable: Message['actionable'] = undefined;

      // Check for intent-based queries (deposit, withdraw, etc.)
      const intent = await extractIntent(currentInput);

      if (intent?.action === 'deposit' && intent.amount) {
        response = `I can help you deposit ${intent.amount} cUSD into your vault.\n\nThis will:\n• Add ${intent.amount} cUSD to your balance\n• Start earning ${currentAPY}% APY\n• Deploy funds to Moola Market\n\nWould you like to proceed?`;
        actionable = {
          type: 'deposit',
          amount: intent.amount,
        };
      } else if (intent?.action === 'withdraw' && intent.amount) {
        response = `I can help you withdraw ${intent.amount} cUSD from your vault.\n\nCurrent vault balance: ${vaultBalance} cUSD\n\nThis will transfer ${intent.amount} cUSD back to your wallet. Proceed?`;
        actionable = {
          type: 'withdraw',
          amount: intent.amount,
        };
      } 
      // Strategy analysis
      else if (currentInput.toLowerCase().includes('strategy') || currentInput.toLowerCase().includes('allocation')) {
        response = await analyzeStrategy(address, currentStrategy as 'Conservative' | 'Balanced' | 'Growth', {
          timeInVault: 'Recently',
          totalDeposited: vaultBalance,
          totalEarnings: earnings,
          currentAPY,
        });
      }
      // Recommendations
      else if (currentInput.toLowerCase().includes('recommend') || currentInput.toLowerCase().includes('advice') || currentInput.toLowerCase().includes('should i')) {
        response = await getRecommendation(address, {
          vaultBalance,
          currentAPY,
          strategy: currentStrategy,
          earnings,
        });
      }
      // Portfolio queries
      else if (currentInput.toLowerCase().includes('balance') || currentInput.toLowerCase().includes('how much')) {
        response = `📊 Your Attestify Portfolio:\n\n• Vault Balance: ${vaultBalance} cUSD\n• Total Earnings: ${earnings} cUSD\n• Current APY: ${currentAPY}%\n• Strategy: ${currentStrategy}\n\nYou're earning approximately $${(parseFloat(vaultBalance) * parseFloat(currentAPY) / 100 / 365).toFixed(4)} per day!`;
      }
      // Performance queries
      else if (currentInput.toLowerCase().includes('performance') || currentInput.toLowerCase().includes('earning')) {
        const roi = vaultBalance !== '0.00' ? ((parseFloat(earnings) / parseFloat(vaultBalance)) * 100).toFixed(2) : '0.00';
        response = `📈 Your Performance:\n\n• Total Earnings: ${earnings} cUSD\n• ROI: ${roi}%\n• Current APY: ${currentAPY}%\n• Strategy: ${currentStrategy}\n\n${parseFloat(earnings) > 0 ? '✅ You\'re in profit! Keep it up!' : '⏳ Your earnings are accumulating. Give it some time!'}`;
      }
      // Risk queries
      else if (currentInput.toLowerCase().includes('risk') || currentInput.toLowerCase().includes('safe')) {
        response = `🛡️ Risk Analysis:\n\n**Your Current Strategy: ${currentStrategy}**\n\n• **Smart Contract Risk**: Audited vault contract\n• **Protocol Risk**: Moola Market is established on Celo\n• **Liquidity Risk**: ${currentStrategy === 'Conservative' ? 'Very Low' : currentStrategy === 'Balanced' ? 'Low' : 'Medium'} (${currentStrategy === 'Conservative' ? '100%' : currentStrategy === 'Balanced' ? '90%' : '80%'} deployed)\n• **Market Risk**: Stablecoin (cUSD) minimizes volatility\n\n✅ Overall: Your funds are relatively safe, earning stable yields.`;
      }
      // General question
      else {
        const context = `User context: Vault balance ${vaultBalance} cUSD, earning ${currentAPY}% APY with ${currentStrategy} strategy.`;
        response = await askQuestion(currentInput, address, context);
      }

      // Add AI response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        actionable,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
  };

  const executeAction = (action: Message['actionable']) => {
    if (!action) return;

    switch (action.type) {
      case 'deposit':
        if (action.amount && onDeposit) {
          onDeposit(action.amount);
          addMessage('assistant', `✅ Initiating deposit of ${action.amount} cUSD...`);
        }
        break;
      case 'withdraw':
        if (action.amount && onWithdraw) {
          onWithdraw(action.amount);
          addMessage('assistant', `✅ Initiating withdrawal of ${action.amount} cUSD...`);
        }
        break;
      case 'strategy':
        if (action.strategy !== undefined && onStrategyChange) {
          onStrategyChange(action.strategy);
          addMessage('assistant', `✅ Changing strategy...`);
        }
        break;
    }
  };

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const message: Message = {
      role,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-4 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="h-10 w-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
            <div className="flex flex-col max-w-2xl">
              <div
                className={`rounded-2xl p-6 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p className={`text-sm whitespace-pre-wrap leading-relaxed ${
                  message.role === 'user' ? 'text-white' : 'text-gray-900'
                }`}>
                  {message.content}
                </p>
                <span className={`text-xs mt-3 block ${
                  message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              
              {/* Actionable buttons */}
              {message.actionable && (
                <button
                  onClick={() => executeAction(message.actionable)}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all shadow-md"
                >
                  ✓ Execute Action
                </button>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4">
            <div className="h-10 w-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-md">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your vault..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        
        {/* Quick Actions */}
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-gray-600">Quick Actions:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickAction('What\'s my current balance?')}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-green-300 transition-all"
            >
              <DollarSign className="h-4 w-4 inline mr-1" />
              Balance
            </button>
            <button
              onClick={() => handleQuickAction('How is my performance?')}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-blue-300 transition-all"
            >
              <TrendingUp className="h-4 w-4 inline mr-1" />
              Performance
            </button>
            <button
              onClick={() => handleQuickAction('Should I change my strategy?')}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-purple-300 transition-all"
            >
              <Target className="h-4 w-4 inline mr-1" />
              Strategy
            </button>
            <button
              onClick={() => handleQuickAction('What are the risks?')}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-orange-300 transition-all"
            >
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Risks
            </button>
          </div>
        </div>

        {!isBrianAIConfigured() && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              ⚠️ <strong>Brian AI not configured.</strong> Add your API key to enable advanced AI features.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


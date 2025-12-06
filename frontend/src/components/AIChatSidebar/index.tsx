'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { Bot, Send, Loader2, TrendingUp, Target, DollarSign, AlertCircle, ArrowDownLeft, ArrowUpRight, X, Minimize2, Maximize2 } from 'lucide-react';
import { API_ENDPOINTS, getAuthHeaders } from '@/config/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatSidebarProps {
  vaultBalance: string;
  currentAPY: string;
  currentStrategy: string;
  earnings: string;
  minDeposit?: string;
  maxDeposit?: string;
  onDeposit?: (amount: string) => void;
  onWithdraw?: (amount: string) => void;
  onStrategyChange?: (strategy: number) => void;
}

export default function AIChatSidebar({ 
  vaultBalance, 
  currentAPY,
  currentStrategy,
  earnings,
  minDeposit,
  maxDeposit,
  onDeposit,
  onWithdraw,
  onStrategyChange
}: AIChatSidebarProps) {
  const { address } = useAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: `Hi! I'm your AI DeFi assistant powered by Attestify. 🤖\n\nI can help you:\n• Manage your vault\n• Analyze your strategy\n• Answer DeFi questions\n• Explain how Attestify works\n\nWhat would you like to know?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  // Call backend API (Attestify Django backend)
  const callBackendAPI = async (message: string): Promise<{ message: string; session_id?: string } | null> => {
    if (!address) return null;

    try {
      const response = await fetch(API_ENDPOINTS.ai.chat, {
        method: 'POST',
        headers: getAuthHeaders(address),
        body: JSON.stringify({
          message,
          session_id: sessionId || undefined,
          wallet_address: address,
          // Pass vault context for better AI responses
          vault_context: {
            balance: vaultBalance,
            apy: currentAPY,
            strategy: currentStrategy,
            earnings: earnings,
            min_deposit: minDeposit,
            max_deposit: maxDeposit,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend API error:', response.status, errorText);
        
        // Throw error with status code for better error handling
        throw new Error(`Backend API returned ${response.status}: ${errorText || 'Unknown error'}`);
      }

      const result = await response.json();
      return {
        message: result.message || result.response || 'I received your message.',
        session_id: result.session_id,
      };
    } catch (error) {
      console.error('Backend API error:', error);
      return null;
    }
  };


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
      // Call backend API (Attestify Django backend with Gemini)
      const backendResponse = await callBackendAPI(currentInput);
      
      if (!backendResponse) {
        throw new Error('Backend API is unavailable. Please check your connection or contact support.');
      }

      const response = backendResponse.message;
      
      // Update session ID if provided
      if (backendResponse.session_id && !sessionId) {
        setSessionId(backendResponse.session_id);
      }

      // Add AI response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Sorry, I encountered an error connecting to the AI service. ';
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage += 'This might be a CORS or network issue. Please check if the backend is running and properly configured.';
      } else if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again later.';
      }
      
      const errorResponse: Message = {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (question: string) => {
    setInput(question);
    // Trigger submit after a brief delay
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  if (isMinimized) {
    return (
      <div className="w-16 bg-white border-l border-gray-200 flex flex-col items-center justify-center">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-1"
          title="Expand AI Assistant"
        >
          <Bot className="h-5 w-5" />
          <span className="text-xs font-medium">AI</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-xs text-gray-600">Ask me anything</p>
          </div>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
          title="Minimize"
        >
          <Minimize2 className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        
        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600">Quick actions:</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleQuickAction('What\'s my balance?')}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition-all"
            >
              <DollarSign className="h-3 w-3 inline mr-1" />
              Balance
            </button>
            <button
              onClick={() => handleQuickAction('How is my performance?')}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition-all"
            >
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Performance
            </button>
            <button
              onClick={() => handleQuickAction('Should I change strategy?')}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition-all"
            >
              <Target className="h-3 w-3 inline mr-1" />
              Strategy
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}


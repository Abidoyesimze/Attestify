/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 * 
 * To configure the backend URL:
 * 1. Set NEXT_PUBLIC_API_URL in your .env.local file (for local development)
 * 2. Set NEXT_PUBLIC_API_URL in your Vercel environment variables (for production)
 * 
 * Example: NEXT_PUBLIC_API_URL=https://your-backend-url.com
 */

// Get backend URL from environment variable or use default
// Update the default URL below to match your deployed backend
export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  process.env.NEXT_PUBLIC_BACKEND_URL || 
  'https://attestify-z5b2.onrender.com'; // Live backend on Render

// API endpoints
export const API_ENDPOINTS = {
  // AI Assistant endpoints
  ai: {
    chat: `${API_BASE_URL}/api/ai_assistant/chat/`,
    conversations: `${API_BASE_URL}/api/ai_assistant/conversations/`,
    conversationHistory: (sessionId: string) => 
      `${API_BASE_URL}/api/ai_assistant/conversations/${sessionId}/`,
    deleteConversation: (sessionId: string) => 
      `${API_BASE_URL}/api/ai_assistant/conversations/${sessionId}/delete/`,
    explainTerm: `${API_BASE_URL}/api/ai_assistant/explain/`,
    strategies: `${API_BASE_URL}/api/ai_assistant/strategies/`,
  },
  // Authentication endpoints
  auth: {
    token: `${API_BASE_URL}/api/auth/token/`,
    refresh: `${API_BASE_URL}/api/auth/token/refresh/`,
  },
} as const;

/**
 * Get authentication headers
 * For now, we'll use wallet address as identifier
 * TODO: Implement proper JWT authentication with wallet signatures
 */
export function getAuthHeaders(walletAddress?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // If we have a token stored, use it
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // For wallet-based auth, we can send wallet address in a custom header
  if (walletAddress) {
    headers['X-Wallet-Address'] = walletAddress;
  }

  return headers;
}


import os
import requests
from typing import List, Dict, Optional
from .context import SYSTEM_CONTEXT, DEFI_GLOSSARY, STRATEGY_COMPARISON

class AIAssistantService:
    """Service for interacting with Google Gemini API"""
    
    def __init__(self):
        self.api_key = os.environ.get('GOOGLE_API_KEY')
        self.api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"
        self.model = "gemini-2.0-flash" 
        
    def _build_context(self, user_data: Optional[Dict] = None) -> str:
        """Build enhanced context with user-specific data"""
        context = SYSTEM_CONTEXT
        
        if user_data:
            user_context = "\n\n## Current User Information\n"
            
            if user_data.get('balance'):
                user_context += f"- Current Balance: {user_data['balance']} cUSD\n"
            
            if user_data.get('total_deposited'):
                user_context += f"- Total Deposited: {user_data['total_deposited']} cUSD\n"
            
            if user_data.get('total_earned'):
                user_context += f"- Total Earned: {user_data['total_earned']} cUSD\n"
            
            if user_data.get('current_strategy'):
                strategy = user_data['current_strategy']
                user_context += f"- Current Strategy: {strategy.title()}\n"
                user_context += f"- Expected APY: {STRATEGY_COMPARISON[strategy]['apy_range']}\n"
            
            if user_data.get('is_new_user'):
                user_context += "- Note: This user is new to the platform\n"
            
            context += user_context
        
        return context
    
    def _create_fallback_response(self, user_message: str) -> str:
        """Generate a helpful fallback response when API fails"""
        message_lower = user_message.lower()
        
        # Strategy questions
        if any(word in message_lower for word in ['strategy', 'conservative', 'balanced', 'growth', 'which']):
            return """I can help you choose a strategy! Here are the three options:

**Conservative (3-5% APY)** - Low risk, best for beginners and short-term savings
**Balanced (5-10% APY)** - Medium risk, good for regular savers
**Growth (10-15% APY)** - Higher risk, for experienced users and long-term goals

To recommend the best one, I'd like to know:
1. How long do you plan to keep funds deposited?
2. How comfortable are you with risk?
3. Is this your first time using DeFi?"""
        
        # Security questions
        elif any(word in message_lower for word in ['safe', 'secure', 'hack', 'scam', 'trust']):
            return """Attestify is designed with security as the top priority:

✅ **Non-Custodial**: You always control your funds
✅ **Audited Contracts**: Following OpenZeppelin security standards
✅ **Battle-Tested**: Uses Aave Market, a proven DeFi protocol
✅ **Identity Verification**: Required to prevent fraud
✅ **Emergency Pause**: Can halt operations if issues detected

Remember: All DeFi carries some risk. Only invest what you can afford to lose!"""
        
        # Withdrawal questions
        elif any(word in message_lower for word in ['withdraw', 'take out', 'remove', 'access']):
            return """You can withdraw your funds anytime! Here's how:

1. Go to your dashboard
2. Click "Withdraw"
3. Enter the amount you want to withdraw
4. Confirm the transaction

**No lock-ups, no penalties, no waiting.** Your funds are available 24/7. Withdrawals typically complete in under 30 seconds."""
        
        # Deposit questions
        elif any(word in message_lower for word in ['deposit', 'add', 'invest', 'start', 'minimum']):
            return """Getting started is simple:

**Minimum**: 1 cUSD (we recommend at least 10 cUSD)
**Maximum**: 10,000 cUSD per user

Steps:
1. Verify your identity (2 minutes)
2. Choose your strategy
3. Enter deposit amount
4. Confirm transaction

Your funds start earning immediately!"""
        
        # APY/Yield questions
        elif any(word in message_lower for word in ['apy', 'yield', 'earn', 'return', 'interest']):
            return """Attestify offers three yield tiers:

🛡️ **Conservative**: 3-5% APY (Low risk)
⚖️ **Balanced**: 5-10% APY (Medium risk)
📈 **Growth**: 10-15% APY (Higher risk)

Yields come from Aave Market lending. They fluctuate based on market demand but have been stable historically.

**Important**: Past performance doesn't guarantee future returns. Yields can vary."""
        
        # DeFi education
        elif any(word in message_lower for word in ['what is', 'explain', 'how does', 'understand']):
            return """I'm here to help you understand DeFi! Some key concepts:

**DeFi**: Decentralized Finance - earning interest without traditional banks
**APY**: Annual Percentage Yield - your yearly earning rate
**Smart Contracts**: Automated programs that handle your funds safely
**Stablecoins**: Cryptocurrencies pegged to $1 USD (like cUSD)

What specific concept would you like me to explain?"""
        
        # General greeting/help
        elif any(word in message_lower for word in ['hello', 'hi', 'hey', 'help', 'start']):
            return """Hello! I'm your Attestify AI assistant . I can help you with:

 -Choosing the right investment strategy
 -Understanding platform security
 -Tracking your earnings
 -Learning about DeFi concepts
 -Answering any questions about Attestify

What would you like to know?"""
        
        # Default response
        else:
            return """I'm here to help you with Attestify! I can answer questions about:

- Investment strategies (Conservative, Balanced, Growth)
- Security and how your funds are protected
- Deposits and withdrawals
- Expected yields and returns
- How DeFi and Attestify work
- General DeFi concepts and education

What specific question can I help you with?"""
    
    def _format_messages_for_gemini(self, messages: List[Dict[str, str]], system_context: str) -> List[Dict]:
        """Convert messages to Gemini format"""
        gemini_messages = []
        
        # Add system context as first user message
        gemini_messages.append({
            "role": "user",
            "parts": [{"text": f"SYSTEM INSTRUCTIONS:\n{system_context}\n\nPlease acknowledge you understand these instructions."}]
        })
        gemini_messages.append({
            "role": "model",
            "parts": [{"text": "I understand. I'm the Attestify AI assistant ready to help with DeFi questions, strategy recommendations, and platform guidance."}]
        })
        
        # Add conversation history
        for msg in messages:
            role = "model" if msg["role"] == "assistant" else "user"
            gemini_messages.append({
                "role": role,
                "parts": [{"text": msg["content"]}]
            })
        
        return gemini_messages
    
    def get_response(
        self,
        messages: List[Dict[str, str]],
        user_data: Optional[Dict] = None
    ) -> Dict:
        """Get AI response for a conversation using Gemini"""
        
        try:
            # Build system context with user data
            system_context = self._build_context(user_data)
            
            # Format messages for Gemini
            gemini_messages = self._format_messages_for_gemini(messages, system_context)
            
            # Prepare API request
            url = f"{self.api_url}?key={self.api_key}"
            
            payload = {
                "contents": gemini_messages,
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 1024,
                }
            }
            
            # Make API call
            response = requests.post(
                url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Extract response from Gemini format
                if 'candidates' in data and len(data['candidates']) > 0:
                    assistant_message = data['candidates'][0]['content']['parts'][0]['text']
                    
                    return {
                        'success': True,
                        'message': assistant_message,
                        'source': 'api',
                        'model': 'gemini-2.0-flash-exp'
                    }
                else:
                    # No valid response - use fallback
                    user_message = messages[-1]['content'] if messages else ""
                    fallback = self._create_fallback_response(user_message)
                    
                    return {
                        'success': True,
                        'message': fallback,
                        'source': 'fallback',
                        'error': 'No candidates in response'
                    }
            else:
                # API error - use fallback
                user_message = messages[-1]['content'] if messages else ""
                fallback = self._create_fallback_response(user_message)
                
                return {
                    'success': True,
                    'message': fallback,
                    'source': 'fallback',
                    'error': f"API returned {response.status_code}: {response.text}"
                }
                
        except Exception as e:
            # Any error - use fallback
            user_message = messages[-1]['content'] if messages else ""
            fallback = self._create_fallback_response(user_message)
            
            return {
                'success': True,
                'message': fallback,
                'source': 'fallback',
                'error': str(e)
            }
    
    def explain_term(self, term: str) -> str:
        """Explain a DeFi term"""
        term_lower = term.lower()
        
        for key, definition in DEFI_GLOSSARY.items():
            if key.lower() == term_lower:
                return f"**{key}**: {definition}"
        
        return f"I don't have a specific definition for '{term}', but I can help explain it in context. What would you like to know about it?"
    
    def compare_strategies(self) -> str:
        """Return formatted strategy comparison"""
        comparison = "## Investment Strategy Comparison\n\n"
        
        for strategy_name, details in STRATEGY_COMPARISON.items():
            comparison += f"### {strategy_name.title()} Strategy\n"
            comparison += f"- **APY Range**: {details['apy_range']}\n"
            comparison += f"- **Risk Level**: {details['risk']}\n"
            comparison += f"- **Best For**: {', '.join(details['ideal_for'])}\n"
            comparison += f"- **Description**: {details['example']}\n\n"
        
        return comparison
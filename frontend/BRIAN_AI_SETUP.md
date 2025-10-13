# Brian AI Setup Guide

## 🎉 Brian AI Integration Complete!

Your AI Chat is now fully integrated and ready to use. Follow these steps to enable AI features.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Brian AI API Key

1. Visit **https://brianknows.org**
2. Click "Sign Up" or "Get Started"
3. Create an account
4. Navigate to Dashboard → API Keys
5. Click "Create New API Key"
6. Copy your API key (starts with `brian_`)

### Step 2: Add API Key to Environment

Create or update `.env.local` in the `frontend` directory:

```bash
cd /home/simze/web3-project/Attestify/frontend
```

Create/edit `.env.local`:
```env
# Brian AI Configuration
NEXT_PUBLIC_BRIAN_AI_KEY=brian_your_api_key_here

# Self Protocol (already configured)
NEXT_PUBLIC_SELF_APP_NAME=Attestify
NEXT_PUBLIC_SELF_SCOPE=attestify

# WalletConnect (already configured)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

**Replace `brian_your_api_key_here` with your actual API key!**

### Step 3: Restart Development Server

```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

### Step 4: Test AI Chat

1. Open http://localhost:3000
2. Connect wallet
3. Complete verification
4. Go to Dashboard → AI Assistant
5. Try asking: "What's my balance?"

---

## ✨ What You Can Do Now

### Portfolio Management
- **"What's my current balance?"** - Get vault overview
- **"Deposit 50 cUSD"** - Initiate deposit with AI
- **"Withdraw 25 cUSD"** - Initiate withdrawal
- **"How is my performance?"** - See earnings & ROI

### Strategy & Recommendations
- **"Should I change my strategy?"** - Get AI recommendations
- **"What's the best strategy for me?"** - Personalized advice
- **"Compare Conservative vs Growth"** - Strategy analysis
- **"When should I deposit more?"** - Market timing advice

### Risk Analysis
- **"What are the risks?"** - Comprehensive risk breakdown
- **"Is my vault safe?"** - Security assessment
- **"What happens if Moola APY drops?"** - Scenario analysis

### Market Insights
- **"What's the best APY on Celo?"** - Market data
- **"How does Attestify compare?"** - Competitive analysis
- **"Should I diversify?"** - Portfolio recommendations

---

## 🎨 AI Chat Features

### Intelligent Intent Detection
The AI understands natural language and can:
- Extract deposit/withdraw amounts
- Recommend strategy changes
- Answer DeFi questions
- Provide market insights

### Quick Action Buttons
Click pre-made queries:
- 💰 Balance - Check your vault balance
- 📈 Performance - See earnings and ROI
- 🎯 Strategy - Get strategy recommendations
- ⚠️ Risks - Understand potential risks

### Actionable Responses
When AI suggests actions, you'll see an **"Execute Action"** button to confirm transactions directly from the chat.

---

## 🔧 Advanced Configuration

### Customize AI Behavior

Edit `src/services/brianAI.ts` to customize:

```typescript
// Change response style
export async function getRecommendation(...) {
  const prompt = `
    ${context}
    
    Please provide recommendations in:
    - Bullet points
    - Simple language
    - With specific numbers
  `;
  // ...
}
```

### Add Custom Quick Actions

Edit `src/components/AIChat/index.tsx`:

```typescript
<button
  onClick={() => handleQuickAction('Your custom query')}
  className="..."
>
  Custom Action
</button>
```

---

## 💰 Brian AI Pricing

### Free Tier
- **100 requests/month**
- Perfect for testing and small user base
- No credit card required

### Pro Tier ($49/month)
- **5,000 requests/month**
- Priority support
- Advanced analytics
- Recommended for production

### Enterprise
- Unlimited requests
- Custom integration
- Dedicated support
- Contact: https://brianknows.org/enterprise

---

## 📊 Monitoring Usage

### Track API Calls

Brian AI dashboard shows:
- Total API calls
- Success/error rates
- Most common queries
- Response times

### Optimize Costs

1. **Cache common responses** - Store FAQ answers
2. **Rate limit users** - Prevent abuse
3. **Batch requests** - Combine similar queries
4. **Use fallbacks** - Handle errors gracefully

---

## 🐛 Troubleshooting

### AI Not Responding

**Problem**: Chat shows "Brian AI is not configured"

**Solution**:
1. Check `.env.local` has `NEXT_PUBLIC_BRIAN_API_KEY`
2. Verify API key is correct (starts with `brian_`)
3. Restart dev server: `npm run dev`
4. Clear browser cache

### API Key Invalid

**Problem**: "Invalid API key" error in console

**Solution**:
1. Log into https://brianknows.org
2. Verify API key is active
3. Check for typos in `.env.local`
4. Generate new API key if needed

### Slow Responses

**Problem**: AI takes too long to respond

**Solution**:
1. Check your internet connection
2. Verify Brian AI service status
3. Consider upgrading to Pro tier
4. Use caching for common queries

### Rate Limit Exceeded

**Problem**: "Rate limit exceeded" error

**Solution**:
1. You've exceeded 100 requests/month (Free tier)
2. Upgrade to Pro tier
3. Or wait until next month
4. Implement request caching

---

## 🔒 Security Best Practices

### Never Expose Private Keys
✅ **DO**: Use Brian AI for public data
❌ **DON'T**: Send private keys to AI

### Validate AI Responses
✅ **DO**: Verify transaction amounts before execution
❌ **DON'T**: Auto-execute without user confirmation

### Rate Limiting
✅ **DO**: Limit requests per user
❌ **DON'T**: Allow unlimited API calls

### Error Handling
✅ **DO**: Show friendly error messages
❌ **DON'T**: Expose API keys in errors

---

## 📚 Resources

- **Brian AI Docs**: https://docs.brianknows.org
- **API Reference**: https://docs.brianknows.org/api-reference
- **Discord**: https://discord.gg/brianai
- **GitHub Examples**: https://github.com/brian-knows/examples
- **Support**: support@brianknows.org

---

## ✅ Setup Checklist

- [ ] Created Brian AI account
- [ ] Generated API key
- [ ] Added key to `.env.local`
- [ ] Restarted dev server
- [ ] Tested chat with "What's my balance?"
- [ ] Tried deposit/withdraw commands
- [ ] Asked for strategy recommendations
- [ ] Checked console for errors
- [ ] Read Brian AI docs

---

## 🎯 Next Steps

1. **Test thoroughly** - Try all chat features
2. **Customize responses** - Edit prompts in `brianAI.ts`
3. **Add analytics** - Track user engagement
4. **Monitor usage** - Watch API call count
5. **Upgrade plan** - If you exceed free tier
6. **Collect feedback** - Ask users what they want
7. **Iterate** - Improve based on usage

---

## 🎉 You're All Set!

Your AI-powered DeFi assistant is ready! Users can now:
- Ask questions in natural language
- Get personalized recommendations
- Execute transactions through chat
- Learn about DeFi concepts
- Optimize their yield strategies

**Happy building! 🚀**

For issues or questions, check the troubleshooting section or visit Brian AI docs.


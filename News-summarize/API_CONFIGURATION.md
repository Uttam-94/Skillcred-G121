# 🔧 API Configuration Guide

This guide explains how to configure and change API settings for the News Summarizer & Bias Detector app when running locally.

## 📋 Quick Setup

### 1. Environment Variables Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file:**
   ```bash
   # On Windows
   notepad .env
   
   # On Mac/Linux
   nano .env
   # or
   code .env
   ```

3. **Configure your API key:**
   ```env
   OPENROUTER_API_KEY=your_actual_api_key_here
   ```

### 2. Restart the Server
After changing environment variables, restart the development server:
```bash
pnpm dev
```

## 🔑 API Key Configuration

### OpenRouter API Key
1. **Get your API key** from [OpenRouter.ai](https://openrouter.ai/)
2. **Update the `.env` file:**
   ```env
   OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
   ```

### Using Different AI Models
You can change the AI model used for analysis:
```env
# GPT Models
DEFAULT_AI_MODEL=openai/gpt-4-turbo
DEFAULT_AI_MODEL=openai/gpt-3.5-turbo

# Claude Models  
DEFAULT_AI_MODEL=anthropic/claude-3-sonnet
DEFAULT_AI_MODEL=anthropic/claude-3-haiku

# Other Models
DEFAULT_AI_MODEL=meta-llama/llama-3-8b-instruct
```

## ⚙️ Advanced Configuration

### Model Parameters
Fine-tune the AI behavior:
```env
# Number of tokens per response (affects length)
MAX_TOKENS=600

# Creativity level (0.0 = very focused, 1.0 = very creative)
TEMPERATURE=0.4

# Different AI model for better performance
DEFAULT_AI_MODEL=openai/gpt-4-turbo
```

### Custom API Endpoints
If you want to use your own API endpoints:
```env
# Custom summarization endpoint
CUSTOM_SUMMARIZE_URL=https://your-api.com/summarize

# Custom bias detection endpoint  
CUSTOM_BIAS_URL=https://your-api.com/bias
```

## 🏗️ Building Your Own API

### Option 1: Extend Current System
Add new API routes in `server/routes/`:

1. **Create new route file:**
   ```bash
   touch server/routes/custom-analysis.ts
   ```

2. **Implement your logic:**
   ```typescript
   import { RequestHandler } from "express";
   
   export const handleCustomAnalysis: RequestHandler = async (req, res) => {
     // Your custom logic here
     const result = await yourCustomFunction(req.body.content);
     res.json(result);
   };
   ```

3. **Register the route in `server/index.ts`:**
   ```typescript
   import { handleCustomAnalysis } from "./routes/custom-analysis";
   
   // Add this line in createServer function:
   app.post("/api/custom-analysis", handleCustomAnalysis);
   ```

### Option 2: External API Integration
Replace OpenRouter with your own service:

1. **Update environment variables:**
   ```env
   # Disable OpenRouter
   OPENROUTER_API_KEY=
   
   # Add your API
   YOUR_API_URL=https://your-service.com/api
   YOUR_API_KEY=your-secret-key
   ```

2. **Modify `server/routes/analyze.ts`:**
   ```typescript
   // Replace OpenRouter calls with your API
   const response = await fetch(process.env.YOUR_API_URL, {
     method: "POST",
     headers: {
       "Authorization": `Bearer ${process.env.YOUR_API_KEY}`,
       "Content-Type": "application/json"
     },
     body: JSON.stringify({
       text: content,
       task: "summarize"
     })
   });
   ```

## 🔧 Development Tips

### Testing Different Configurations
1. **Create multiple environment files:**
   ```bash
   .env.development  # For development
   .env.testing      # For testing
   .env.production   # For production
   ```

2. **Load specific config:**
   ```bash
   # Load testing config
   cp .env.testing .env
   pnpm dev
   ```

### Debugging API Issues
1. **Check server logs** in your terminal
2. **Verify API key** is correct
3. **Test API endpoint** manually:
   ```bash
   curl -X POST http://localhost:8080/api/analyze \\
     -H "Content-Type: application/json" \\
     -d '{"content": "Test news article", "type": "text"}'
   ```

### Performance Optimization
```env
# Faster responses (shorter summaries)
MAX_TOKENS=200
TEMPERATURE=0.2

# Better quality (longer processing)
MAX_TOKENS=800
TEMPERATURE=0.5
DEFAULT_AI_MODEL=openai/gpt-4-turbo
```

## 🚨 Security Best Practices

1. **Never commit `.env` files** to git
2. **Use different API keys** for development and production
3. **Rotate API keys** regularly
4. **Monitor API usage** to detect anomalies

## 📊 Cost Management

### OpenRouter Pricing Tips
- **Use GPT-3.5-turbo** for development (cheaper)
- **Use GPT-4** for production (better quality)
- **Set MAX_TOKENS** appropriately to control costs
- **Monitor usage** on OpenRouter dashboard

### Example Cost-Effective Setup
```env
# Development (lower cost)
DEFAULT_AI_MODEL=openai/gpt-3.5-turbo
MAX_TOKENS=300
TEMPERATURE=0.3

# Production (higher quality)
DEFAULT_AI_MODEL=openai/gpt-4-turbo
MAX_TOKENS=500
TEMPERATURE=0.4
```

## 🔄 Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENROUTER_API_KEY` | (required) | Your OpenRouter API key |
| `OPENROUTER_API_URL` | `https://openrouter.ai/api/v1/chat/completions` | OpenRouter endpoint |
| `DEFAULT_AI_MODEL` | `openai/gpt-3.5-turbo` | AI model to use |
| `MAX_TOKENS` | `400` | Maximum response length |
| `TEMPERATURE` | `0.3` | AI creativity level (0.0-1.0) |
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `8080` | Server port |

## 🆘 Troubleshooting

### Common Issues

**❌ "API key not found" error:**
```bash
# Check if .env file exists
ls -la .env

# Check if key is set
cat .env | grep OPENROUTER_API_KEY
```

**❌ "Failed to analyze content" error:**
- Verify your API key is valid
- Check your OpenRouter account credits
- Ensure internet connection is stable

**❌ Server not restarting after changes:**
```bash
# Kill existing process
pkill -f "pnpm dev"

# Restart
pnpm dev
```

### Getting Help
1. Check the [OpenRouter documentation](https://openrouter.ai/docs)
2. Review server logs in terminal
3. Test with a simple text input first
4. Verify environment variables are loaded correctly

---

## 🎯 Quick Commands

```bash
# Setup
cp .env.example .env
nano .env  # Edit your API key
pnpm dev   # Start server

# Testing
curl -X POST localhost:8080/api/analyze -H "Content-Type: application/json" -d '{"content":"test","type":"text"}'

# Reset
rm .env
cp .env.example .env
```

Happy analyzing! 🚀

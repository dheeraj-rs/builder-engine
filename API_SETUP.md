# Anthropic API Setup Guide

## Getting Your API Key

1. **Visit the Anthropic Console**: Go to [console.anthropic.com](https://console.anthropic.com/)
2. **Sign up or log in** to your account
3. **Navigate to API Keys**: Find the API Keys section in your dashboard
4. **Create a new key** or copy an existing one
   - Your API key will look like: `sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx`

## Setting Up Your Environment

### Update `.env.local`

1. Open the `.env.local` file in the root of your project (`/Users/dheeraj/work/bolt.new/.env.local`)

2. Replace the placeholder with your actual API key:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

**IMPORTANT**: Replace `sk-ant-api03-your-actual-key-here` with your real API key from Anthropic.

### Restart the Development Server

After updating the `.env.local` file, restart your dev server:

```bash
# Press Ctrl+C in the terminal to stop the current server
# Then run:
npm run dev
```

## Verifying the Setup

1. **Open your browser** and navigate to `http://localhost:5173/`
2. **Start a new chat** or open an existing one
3. **Send a test message** like "Hello, can you help me build a website?"
4. **Check the terminal** for any errors:
   - ✅ **Success**: You should see no API errors
   - ❌ **Error**: If you see "invalid x-api-key" or "model not found", double-check your API key

## Current Configuration

- **Model**: `claude-sonnet-4-5-20250929` (Claude Sonnet 4.5 - Latest as of 2025)
- **Max Tokens**: 8192
- **API Endpoint**: `https://api.anthropic.com/v1/messages`

## Troubleshooting

### "LoadAPIKeyError: Anthropic API key is missing"

- Make sure `.env.local` exists in the project root
- Verify the file contains `ANTHROPIC_API_KEY=your-key`
- Restart the dev server after making changes

### "APICallError: model: claude-3-5-sonnet-20240620"

- This means the model version is outdated
- The code has been updated to use `claude-3-5-sonnet-20241022`
- Restart the dev server to pick up the changes

### "invalid x-api-key" (401 error)

- Your API key is incorrect or inactive
- Get a new key from [console.anthropic.com](https://console.anthropic.com/)
- Make sure there are no extra spaces or quotes around the key

## Cost Information

Claude 3.5 Sonnet pricing (as of December 2024):

- **Input**: $3 per million tokens
- **Output**: $15 per million tokens

Monitor your usage at [console.anthropic.com](https://console.anthropic.com/)

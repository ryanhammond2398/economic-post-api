const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/generate-post', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{
          role: 'user',
          content: 'Search the web for the most important US economic news from today. Then write a Facebook post under 150 words as 3 short paragraphs. Plain text only. No intro. No markdown. No bold. No bullet points. No cliches. Add 1-2 emojis naturally in the text. Output ONLY the post text, nothing else.'
        }]
      })
    });

    const data = await response.json();

    // Extract only text blocks and find the last one (the actual post)
    const textBlocks = data.content.filter(block => block.type === 'text' && block.text && block.text.trim().length > 50);
    
    if (textBlocks.length === 0) {
      return res.status(500).json({ error: 'No text content returned from Claude' });
    }

    // Get the last text block which is always the final post
    const postText = textBlocks[textBlocks.length - 1].text.trim();

    // Return as plain text so Make.com can use it directly
    res.setHeader('Content-Type', 'text/plain');
    res.send(postText);

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Economic post API running on port ${PORT}`);
});

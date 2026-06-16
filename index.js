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
          content: `Search the web for the most important US economic news from today.

Then write a short Facebook post about it. Follow these rules strictly:

- Write like a real person sharing news they find interesting, not like a news anchor or AI
- Use plain conversational language that everyday people understand
- 3 short paragraphs, under 150 words total
- Include real numbers and facts from today's news
- No intro phrases like "here is" or "today we look at"
- No cliches like "all eyes are on" or "markets are watching"
- No markdown, no bold, no bullet points, no dashes, no dividers
- No hype words like "stunning" or "shocking"
- Add 1-2 relevant emojis naturally
- Start your response with the very first word of the post itself, nothing before it`
        }]
      })
    });

    const data = await response.json();

    const textBlocks = data.content.filter(block => block.type === 'text' && block.text && block.text.trim().length > 50);
    
    if (textBlocks.length === 0) {
      return res.status(500).json({ error: 'No text content returned from Claude' });
    }

    const postText = textBlocks[textBlocks.length - 1].text.trim();

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

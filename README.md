# Economic Post API

A simple API that generates daily economic Facebook posts using Claude AI with web search.

## Setup on Render.com (Free)

1. Go to github.com and create a free account
2. Create a new repository called "economic-post-api"
3. Upload all these files to it
4. Go to render.com and create a free account
5. Click "New" → "Web Service"
6. Connect your GitHub repository
7. Render will auto-detect the settings
8. Add environment variable:
   - Key: ANTHROPIC_API_KEY
   - Value: your Anthropic API key
9. Click "Create Web Service"
10. Wait 2-3 minutes for it to deploy
11. You'll get a URL like: https://economic-post-api.onrender.com

## Using in Make.com

Replace your current HTTP module with:
- URL: https://your-app-name.onrender.com/generate-post
- Method: GET
- No headers needed
- No body needed

In Facebook Pages module set Post caption to:
{{1.data}}

That's it! The API handles everything and always returns clean plain text.

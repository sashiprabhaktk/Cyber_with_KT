import re

with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Specifically target the stats section broken characters
content = content.replace('Top 4% ðŸ‡±ðŸ‡°', 'Top 4% 🇱🇰')
# And any remaining hero section flag issues
content = content.replace('Top 4%) ðŸ‡±ðŸ‡°', 'Top 4%) 🇱🇰')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('index.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Fix status marker
content = re.sub(r'<span class="status-marker">.*?</span>', '<span class="status-marker pulsing-dot"></span>', content)

# Fix arrows (common broken variants)
content = content.replace('â†’', '&rarr;')
content = content.replace('â†''', '&rarr;') # Sometimes single quotes get weird
content = content.replace('â†”', '&rarr;')

# Fix the flag area - just make it solid
# Example: Experience @THM (Top 4%) 🇱🇰
# Ensure it's correct
content = content.replace('ðŸ‡±ðŸ‡°', '🇱🇰')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

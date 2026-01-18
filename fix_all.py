import os

file_path = r'g:\Project\GitHub\Cyber_with_KT\index.html'

# Read as bytes to avoid encoding issues
with open(file_path, 'rb') as f:
    content = f.read()

# Replace the common garbled sequences
# Arrow: â†’ (E2 86 92 in Latin-1 interpreted as UTF-8?)
# Actually, the tool output showed "â†’" which is C3 A2 E2 80 a0 E2 80 99 in UTF-8
# but let's just use the string replacement on a decoded string.

try:
    text = content.decode('utf-8-sig') # Handle BOM
except:
    text = content.decode('latin-1')

# Define replacements
replacements = {
    'â†’': '→',
    'â—': '●',
    'ðŸ‡±ðŸ‡°': '🇱🇰',
    '&rarr;†’': '→',
    '→†’': '→',
    'â†&#144;': '→'
}

for old, new in replacements.items():
    text = text.replace(old, new)

# Write back as clean UTF-8 without BOM (Vite/Subagents prefer it)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed")

import os

file_path = r'g:\Project\GitHub\Cyber_with_KT\index.html'

# Use binary mode to read and handle potential encoding mess
with open(file_path, 'rb') as f:
    content = f.read()

# Try to decode from UTF-8 first, then fallback
try:
    text = content.decode('utf-8')
except UnicodeDecodeError:
    text = content.decode('latin-1')

# replacements
# â—  (Status dot) -> &#9679;
text = text.replace('â—', '&#9679;')
# ðŸ‡±ðŸ‡° (Sri Lanka Flag) -> &#127473;&#127472;
text = text.replace('ðŸ‡±ðŸ‡°', '&#127473;&#127472;')
# â†’ (Arrow) -> &rarr;
text = text.replace('â†’', '&rarr;')

# Just in case there are other garbled arrows
text = text.replace('â†&#144;', '&rarr;') 

# Write back as clean UTF-8
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Replacement complete.")

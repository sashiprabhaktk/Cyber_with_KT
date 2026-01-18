import os

file_path = r'g:\Project\GitHub\Cyber_with_KT\index.html'

with open(file_path, 'rb') as f:
    content = f.read()

# Replace interpreted UTF-8 sequences
# Arrow: E2 86 92
content = content.replace(b'\xe2\x86\x92', b'&rarr;')
# Bullet: E2 97 8F
content = content.replace(b'\xe2\x97\x8f', b'&#9679;')
# Sri Lanka Flag: F0 9F 87 B1 F0 9F 87 B0
content = content.replace(b'\xf0\x9f\x87\xb1\xf0\x9f\x87\xb0', b'&#127473;&#127472;')

# Also handle if they were literal "â†’" etc. from bad writes
# This is tricky because the bad writes might have been saved in UTF-8
# if I used Set-Content -Encoding utf8.
# If I search for "â†’" in a utf-8 file, it's actually:
# â (C3 A2), † (E2 80 a0), ’ (E2 80 99)
# Wait, let's just use Python's replace on the decoded string.

try:
    decoded = content.decode('utf-8')
except:
    decoded = content.decode('latin-1')

# Common garbled patterns
decoded = decoded.replace('â†’', '&rarr;')
decoded = decoded.replace('â—', '&#9679;')
decoded = decoded.replace('ðŸ‡±ðŸ‡°', '&#127473;&#127472;')
decoded = decoded.replace('&rarr;†’', '&rarr;') # Fix the previous mess

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(decoded)

print("Done")

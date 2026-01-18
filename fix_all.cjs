const fs = require('fs');
const path = 'g:\\Project\\GitHub\\Cyber_with_KT\\index.html';

let content = fs.readFileSync(path, 'latin1');

const replacements = {
    'â†’': '→',
    'â—': '●',
    'ðŸ‡±ðŸ‡°': '🇱🇰',
    '&rarr;†’': '→',
    '→†’': '→',
    'â†&#144;': '→'
};

for (const [old, newStr] of Object.entries(replacements)) {
    content = content.split(old).join(newStr);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed');

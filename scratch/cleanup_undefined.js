const fs = require('fs');

let content = fs.readFileSync('src/lib/data/conceptual.ts', 'utf8');

// Clean up trailing commas before array closing brackets '],', '];'
content = content.replace(/,\s*,/g, ',');
content = content.replace(/,\s*\]/g, ']');

fs.writeFileSync('src/lib/data/conceptual.ts', content);
console.log('Cleaned up array commas');

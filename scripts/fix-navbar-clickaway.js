const fs = require('fs');
let n = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
n = n.replace(/@click\.away=".*?"/g, '');
fs.writeFileSync('src/components/Navbar.tsx', n);
console.log('Fixed Navbar');

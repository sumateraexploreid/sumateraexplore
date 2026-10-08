const fs = require('fs');

let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
nav = nav.replace(/:aria-expanded="open"/g, 'aria-expanded="false"');
fs.writeFileSync('src/components/Navbar.tsx', nav);

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');
page = page.replace(/\{true \? \<\>\) srcset=".*?" sizes="280px" \<\/>\) : null \}/g, '');
fs.writeFileSync('src/app/page.tsx', page);

console.log('Fixed syntax issues manually 4');

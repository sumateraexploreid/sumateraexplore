const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');
page = page.replace(/\<\/\>\) : null\}/g, '</>}');
fs.writeFileSync('src/app/page.tsx', page);

let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
nav = nav.replace(/\{ \$isHome \? \(\<\> aria-current="page" \<\/\>\) : null\}/g, 'aria-current="page"');
fs.writeFileSync('src/components/Navbar.tsx', nav);

console.log('Fixed final final final syntax errors');

const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');
page = page.replace(/\<\/\>\}/g, '</>) : null}');
fs.writeFileSync('src/app/page.tsx', page);

let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
nav = nav.replace(/@mouseenter=".*?"/g, '');
nav = nav.replace(/@mouseleave=".*?"/g, '');
nav = nav.replace(/:aria-expanded=".*?"/g, 'aria-expanded="false"');
nav = nav.replace(/\{ \$isPkg \? \(\<\> aria-current="page" \<\/\>\) : null\}/g, 'aria-current="page"');
fs.writeFileSync('src/components/Navbar.tsx', nav);

console.log('Fixed final final final syntax errors 6');

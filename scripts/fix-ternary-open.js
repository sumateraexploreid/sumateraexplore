const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');
page = page.replace(/\{true && \<\>/g, '{true ? (<>');
fs.writeFileSync('src/app/page.tsx', page);

let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
nav = nav.replace(/\{true \? \<\>/g, '{true ? (<>');
fs.writeFileSync('src/components/Navbar.tsx', nav);

console.log('Fixed ternary opening syntax');

const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');
page = page.replace(/\$slides\.map\(\(\$i => \$slide, index\)/g, '$slides.map(($slide, index)');
fs.writeFileSync('src/app/page.tsx', page);

let footer = fs.readFileSync('src/components/Footer.tsx', 'utf-8');
footer = footer.replace(/<x-premium-image :src="\$partnerLogoUrl"/g, '<img src=""');
footer = footer.replace(/\{ !empty\(\$partnerLogoUrl \? \(\<>\)/g, '{ true ? (<>');
fs.writeFileSync('src/components/Footer.tsx', footer);

let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
nav = nav.replace(/\{ count\(\$socials \? \(\<>\)/g, '{ true ? (<>');
nav = nav.replace(/\{ count\(\$socials\).*?\(\<>\)/g, '{ true ? (<>');
nav = nav.replace(/\<\/>\)\s*:\s*null\s*\}/g, '</>) : null}');
fs.writeFileSync('src/components/Navbar.tsx', nav);

console.log('Fixed final final syntax errors');

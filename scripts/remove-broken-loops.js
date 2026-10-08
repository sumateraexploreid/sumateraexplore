const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');
page = page.replace(/<div className="absolute top-3 left-3[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '</div></div>');
fs.writeFileSync('src/app/page.tsx', page);

let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
nav = nav.replace(/\{ count\(\$navPackages[\s\S]*?\<\/\> : null\}/g, '');
fs.writeFileSync('src/components/Navbar.tsx', nav);

console.log('Removed broken loops');

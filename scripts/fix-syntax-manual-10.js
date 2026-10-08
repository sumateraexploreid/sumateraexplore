const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');
page = page.replace(/\<\/React\.Fragment\>\)\) \}/g, '</React.Fragment>))}');
fs.writeFileSync('src/app/page.tsx', page);

let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
nav = nav.replace(/\{ \$link\['active'\] \? \(\<\> aria-current="page" \<\/\>\) : null\}/g, '');
fs.writeFileSync('src/components/Navbar.tsx', nav);

console.log('Fixed syntax 10');

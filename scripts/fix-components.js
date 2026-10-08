const fs = require('fs');

function processFile(path, name) {
    let jsx = fs.readFileSync(path, 'utf-8');
    jsx = jsx.replace(/x-data=".*?"/g, '')
             .replace(/@click(?:.prevent)?=".*?"/g, '')
             .replace(/x-bind:class=".*?"/g, '')
             .replace(/x-show=".*?"/g, '')
             .replace(/x-transition.*?=".*?"/g, '')
             .replace(/x-transition/g, '')
             .replace(/x-cloak/g, '')
             .replace(/x-ref=".*?"/g, '')
             .replace(/@scroll.window=".*?"/g, '')
             .replace(/style=".*?"/g, '') // remove style attributes for now to avoid React style object errors
             .replace(/class=/g, 'className=');

    jsx = `import React from 'react';\n\nexport default function ${name}() {\n  return (\n    <>\n${jsx}\n    </>\n  );\n}\n`;
    fs.writeFileSync(path, jsx);
}

processFile('src/components/Navbar.tsx', 'Navbar');
processFile('src/components/Footer.tsx', 'Footer');
console.log('Fixed Navbar and Footer');

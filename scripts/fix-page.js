const fs = require('fs');

let jsx = fs.readFileSync('../resources/views/tour/index.blade.php.jsx', 'utf-8');

jsx = jsx.replace(/<x-[a-zA-Z0-9\-]+\s*(.*?)\/>/g, '<div>Component</div>')
         .replace(/<HomeSlider.*?\/>/g, '<div>HomeSlider Placeholder</div>')
         .replace(/<PackageCard.*?\/>/g, '<div>PackageCard Placeholder</div>')
         .replace(/<BlogCard.*?\/>/g, '<div>BlogCard Placeholder</div>');

jsx = jsx.replace(/x-data=".*?"/g, '')
         .replace(/@click(?:.prevent)?=".*?"/g, '')
         .replace(/x-bind:class=".*?"/g, '')
         .replace(/x-show=".*?"/g, '')
         .replace(/x-transition.*?=".*?"/g, '')
         .replace(/x-transition/g, '')
         .replace(/x-cloak/g, '')
         .replace(/x-ref=".*?"/g, '')
         .replace(/style=".*?"/g, '')
         .replace(/class=/g, 'className=')
         .replace(/for=/g, 'htmlFor=');

jsx = `import React from 'react';\n\nexport default function Home() {\n  return (\n    <main>\n${jsx}\n    </main>\n  );\n}\n`;

fs.writeFileSync('src/app/page.tsx', jsx);
console.log('Fixed page.tsx');

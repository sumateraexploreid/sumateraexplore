const fs = require('fs');

['src/app/page.tsx', 'src/components/Navbar.tsx', 'src/components/Footer.tsx'].forEach(f => {
    let content = fs.readFileSync(f, 'utf-8');
    content = content.replace(/\<\/\>\}/g, '</>) : null}');
    fs.writeFileSync(f, content);
});

console.log('Fixed ternary ending syntax');

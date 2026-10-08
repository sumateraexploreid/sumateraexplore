const fs = require('fs');

['src/components/Navbar.tsx', 'src/components/Footer.tsx', 'src/app/page.tsx'].forEach(f => {
    let data = fs.readFileSync(f, 'utf-8');
    
    // Fix remaining PHP references
    data = data.replace(/\{.*?\\App\\Helpers.*?whatsappDisplay2\(\)\s*\}/g, '08123456789');
    
    // Fix bad map loops
    data = data.replace(/\$packages\.map\(\(\$index => \$pkg, index\)/g, '$packages.map(($pkg, index)');
    data = data.replace(/\$socials\.map\(\(\$name => \$url, index\)/g, '$socials.map(($url, index)');
    
    // Fix remaining Alpine binding
    data = data.replace(/:className=".*?"/g, '');
    
    fs.writeFileSync(f, data);
});
console.log('Fixed final syntax errors part 2');

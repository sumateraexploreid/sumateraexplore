const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');
page = page.replace(/:><\/div>/g, ' ></div>');
page = page.replace(/:style=".*?"/g, '');
fs.writeFileSync('src/app/page.tsx', page);

let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
nav = nav.replace(/<x-icon :name="\$name" className="w-3\.5 h-3\.5" \/>/g, '<span className="w-3.5 h-3.5">icon</span>');
fs.writeFileSync('src/components/Navbar.tsx', nav);

let footer = fs.readFileSync('src/components/Footer.tsx', 'utf-8');
footer = footer.replace(/\{ -- contact_phone removed as requested to strictly display only the whatsapp line \}/g, '{/* contact_phone removed */}');
fs.writeFileSync('src/components/Footer.tsx', footer);

console.log('Fixed syntax issues manually');

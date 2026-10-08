const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');
page = page.replace(/\{\s*\$settings\['show_slider'\] \?\? true \? \(\<\>[\s\S]*?\<\/\>\}/g, "{ $settings['show_slider'] ?? true ? (<>\n    <div>HomeSlider Placeholder</div>\n    </>) : null}");
fs.writeFileSync('src/app/page.tsx', page);

let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
nav = nav.replace(/\<\/\>\) : null\}/g, '</>}');
fs.writeFileSync('src/components/Navbar.tsx', nav);

console.log('Fixed syntax 8');

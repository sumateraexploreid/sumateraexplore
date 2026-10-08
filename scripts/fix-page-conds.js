const fs = require('fs');
let p = fs.readFileSync('src/app/page.tsx', 'utf-8');

// Replace PHP str_pad
p = p.replace(/\{ str_pad\(\(string\) \(\$i \+ 1\), 2, '0', STR_PAD_LEFT\) \}/g, '01');

// Replace leftover conditionals that are broken
p = p.replace(/\{ \$slideCap !== '' \? \(\<\>/g, '{true && <>');
p = p.replace(/\<\/\>\) : null \}/g, '</>}');

fs.writeFileSync('src/app/page.tsx', p);
console.log('Fixed page conditionals');

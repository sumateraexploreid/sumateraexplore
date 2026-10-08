const fs = require('fs');

let jsx = fs.readFileSync('../resources/views/tour/index.blade.php.jsx', 'utf-8');

jsx = jsx.replace(/<x-([a-zA-Z0-9\-]+)(.*?)\/>/g, (match, p1, p2) => {
    const componentName = p1.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    const props = p2.replace(/:([a-zA-Z0-9_]+)="\$([a-zA-Z0-9_]+)"/g, '$1={$2}');
    return '<' + componentName + props + ' />';
});

fs.writeFileSync('../resources/views/tour/index.blade.php.jsx', jsx);
console.log('Replaced Blade components');

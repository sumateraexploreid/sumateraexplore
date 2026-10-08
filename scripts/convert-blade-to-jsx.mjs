import fs from 'fs';
import path from 'path';

function convertBladeToJsx(html) {
  let jsx = html
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/<!--/g, '{/*')
    .replace(/-->/g, '*/}')
    .replace(/@if\s*\((.*?)\)([\s\S]*?)@endif/g, '{ $1 ? (<>$2</>) : null }')
    .replace(/@foreach\s*\((.*?) as (.*?)\)([\s\S]*?)@endforeach/g, '{ $1.map(($2, index) => (<React.Fragment key={index}>$3</React.Fragment>)) }')
    .replace(/\{\{\s*(.*?)\s*\}\}/g, '{ $1 }')
    .replace(/@json\((.*?)\)/g, 'JSON.stringify($1)')
    .replace(/@js\((.*?)\)/g, 'JSON.stringify($1)')
    .replace(/<img(.*?)>/g, (match) => {
        if (!match.endsWith('/>')) {
            return match.slice(0, -1) + ' />';
        }
        return match;
    })
    .replace(/<hr(.*?)>/g, (match) => {
        if (!match.endsWith('/>')) {
            return match.slice(0, -1) + ' />';
        }
        return match;
    })
    .replace(/<br(.*?)>/g, (match) => {
        if (!match.endsWith('/>')) {
            return match.slice(0, -1) + ' />';
        }
        return match;
    })
    .replace(/<input(.*?)>/g, (match) => {
        if (!match.endsWith('/>')) {
            return match.slice(0, -1) + ' />';
        }
        return match;
    });
  
  return jsx;
}

const sourceFile = process.argv[2];
const html = fs.readFileSync(sourceFile, 'utf-8');

const contentMatch = html.match(/@section\('content'\)([\s\S]*?)@endsection/);
const bodyContent = contentMatch ? contentMatch[1] : html;

const jsx = convertBladeToJsx(bodyContent);
fs.writeFileSync(sourceFile + '.jsx', jsx);
console.log('Done!');

// Membuat daftar semua file di public/ -> src/generated/public-files.json.
// Dipakai imageUrl() untuk meniru file_exists()/Storage::exists() Laravel tanpa
// membaca disk saat runtime (di Vercel, public/ tidak ada di fungsi serverless).
import { readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = join(process.cwd(), "public");
const out = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else out.push(relative(root, full).split(sep).join("/"));
  }
}
walk(root);

mkdirSync(join(process.cwd(), "src", "generated"), { recursive: true });
writeFileSync(
  join(process.cwd(), "src", "generated", "public-files.json"),
  JSON.stringify(out.sort()),
);
console.log(`public-files.json: ${out.length} berkas`);

import fs from 'node:fs';import path from 'node:path';
const root=process.cwd();let errors=0;
function test(ok,label){console.log((ok?'PASS':'FAIL')+' '+label);if(!ok)errors++}
const imageFiles=['rose-pedestal','orchid-atelier','driftwood-garden','bromeliad-grove','ceremony-in-bloom','corporate-evergreen'];
for(const name of imageFiles)test(fs.existsSync(path.join(root,'public/images/products',name+'.webp')),'Product image '+name);
test(fs.existsSync(path.join(root,'public/images/editorial/hero-poster.webp')),'Hero poster');
test(fs.existsSync(path.join(root,'src/app/[locale]/layout.tsx')),'Locale layout');
for(const name of ['collections','products','events','about','contact','faq','custom-order']){
 const rel=name==='collections'?'collections/page.tsx':name==='products'?'products/[slug]/page.tsx':name+'/page.tsx';
 test(fs.existsSync(path.join(root,'src/app/[locale]',rel)),name+' route');
}
test(fs.existsSync(path.join(root,'src/app/api/inquiries/route.ts')),'Inquiry API');
test(fs.existsSync(path.join(root,'supabase.sql')),'Supabase schema');
test(fs.existsSync(path.join(root,'src/middleware.ts')),'Locale redirects');
process.exitCode=errors?1:0;

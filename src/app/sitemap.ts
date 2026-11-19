import type {MetadataRoute} from 'next';
import {collections,products} from '@/floral/catalog';
export default function sitemap():MetadataRoute.Sitemap{
 const base=(process.env.NEXT_PUBLIC_SITE_URL||(process.env.VERCEL_URL?'https://'+process.env.VERCEL_URL:'http://localhost:3000')).replace(/\/$/,'');
 const paths=['','/collections','/events','/about','/contact','/faq','/custom-order',...collections.map(c=>`/collections/${c.slug}`),...products.map(p=>`/products/${p.slug}`)];
 return paths.flatMap(path=>['en','ko'].map(locale=>({url:`${base}/${locale}${path}`,changeFrequency:'monthly' as const,priority:path===''?1:0.7})));
}

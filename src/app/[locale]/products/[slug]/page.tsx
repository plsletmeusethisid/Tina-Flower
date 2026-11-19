import type {Metadata} from 'next';
import {loc,getProduct} from '@/floral/catalog';
import {notFound} from 'next/navigation';
import {ProductDetailPage} from '@/floral/Pages';
import {products} from '@/floral/catalog';
export function generateStaticParams(){return products.map(p=>({slug:p.slug}))}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!products.some(p=>p.slug===slug))notFound();return <ProductDetailPage slug={slug}/>}

export async function generateMetadata({params}:{params:Promise<{locale:string;slug:string}>}):Promise<Metadata>{
 const {locale,slug}=await params;const p=getProduct(slug);if(!p)return {};
 const language=locale==='ko'?'ko':'en';return {title:loc(p,'name',language)+' | '+(language==='ko'?'티나 플라워':'Tina Flower Atelier'),description:loc(p,'description',language),alternates:{canonical:`/${locale}/products/${slug}`,languages:{en:`/en/products/${slug}`,ko:`/ko/products/${slug}`}}};
}

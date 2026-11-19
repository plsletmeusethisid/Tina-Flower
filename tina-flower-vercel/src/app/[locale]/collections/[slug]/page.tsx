import type {Metadata} from 'next';
import {loc,getCollection} from '@/floral/catalog';
import {notFound} from 'next/navigation';
import {CollectionDetailPage} from '@/floral/Pages';
import {collections} from '@/floral/catalog';
export function generateStaticParams(){return collections.map(c=>({slug:c.slug}))}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!collections.some(c=>c.slug===slug))notFound();return <CollectionDetailPage slug={slug}/>}

export async function generateMetadata({params}:{params:Promise<{locale:string;slug:string}>}):Promise<Metadata>{
 const {locale,slug}=await params;const c=getCollection(slug);if(!c)return {};
 const language=locale==='ko'?'ko':'en';return {title:loc(c,'name',language)+' | '+(language==='ko'?'티나 플라워':'Tina Flower Atelier'),description:loc(c,'summary',language),alternates:{canonical:`/${locale}/collections/${slug}`,languages:{en:`/en/collections/${slug}`,ko:`/ko/collections/${slug}`}}};
}

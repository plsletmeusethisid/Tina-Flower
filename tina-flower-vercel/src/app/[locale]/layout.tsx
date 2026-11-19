import type {Metadata,Viewport} from 'next';
import {notFound} from 'next/navigation';
import '../globals.css';
import {LocaleProvider,type Locale} from '@/floral/i18n';
import {SiteHeader,SiteFooter} from '@/floral/layout';
import {ScrollChoreography} from '@/components/ScrollChoreography';
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#F5F1E9'};
export function generateStaticParams(){return [{locale:'en'},{locale:'ko'}]}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params;const ko=locale==='ko';
 return {
  metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||(process.env.VERCEL_URL?'https://'+process.env.VERCEL_URL:'http://localhost:3000')),
  title:ko?'티나 플라워 | 자연을 아름답게 담아내다':'Tina Flower Atelier | Nature, Beautifully Composed',
  description:ko?'소중한 순간을 위한 아름다운 꽃장식, 난초, 테라리움과 맞춤 꽃 디자인.':'Signature floral arrangements, orchids, terrariums, indoor plants and thoughtful floral design.',
  openGraph:{type:'website',images:[{url:'/images/editorial/opengraph.webp',width:1200,height:630}]},
 };
}
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){
 const {locale}=await params;if(locale!=='en'&&locale!=='ko')notFound();
 return <html lang={locale}><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Manrope:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;600;700&family=Noto+Serif+KR:wght@400;500;600&display=swap" rel="stylesheet"/></head><body><LocaleProvider locale={locale as Locale}><div id="top" className={'fl-site '+(locale==='ko'?'fl-ko':'')}><SiteHeader/><ScrollChoreography/><main id="main-content">{children}</main><SiteFooter/></div></LocaleProvider></body></html>;
}

import type {Metadata} from 'next';
import { AboutPage } from '@/floral/Pages';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params;const ko=locale==='ko';
 return {title:(ko?'스튜디오':'The Studio')+' | '+(ko?'티나 플라워':'Tina Flower Atelier'),description:ko?'티나 플라워의 꽃 디자인 철학을 만나보세요.':'The artistic approach of Tina Flower Atelier.',alternates:{canonical:`/${locale}/about`,languages:{en:'/en/about',ko:'/ko/about'}}};
}
export default function Page(){return <AboutPage/>}

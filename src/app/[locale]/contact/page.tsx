import type {Metadata} from 'next';
import { ContactPage } from '@/floral/Pages';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params;const ko=locale==='ko';
 return {title:(ko?'문의':'Contact')+' | '+(ko?'티나 플라워':'Tina Flower Atelier'),description:ko?'티나 플라워에 꽃장식 제작을 문의해 주세요.':'Contact Tina Flower Atelier about floral arrangements.',alternates:{canonical:`/${locale}/contact`,languages:{en:'/en/contact',ko:'/ko/contact'}}};
}
export default function Page(){return <ContactPage/>}

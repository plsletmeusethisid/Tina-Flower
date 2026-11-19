import type {Metadata} from 'next';
import { FAQPage } from '@/floral/Pages';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params;const ko=locale==='ko';
 return {title:(ko?'자주 묻는 질문':'Frequently Asked Questions')+' | '+(ko?'티나 플라워':'Tina Flower Atelier'),description:ko?'맞춤 제작과 주문에 관한 자주 묻는 질문.':'Helpful answers about orders and custom florals.',alternates:{canonical:`/${locale}/faq`,languages:{en:'/en/faq',ko:'/ko/faq'}}};
}
export default function Page(){return <FAQPage/>}

import type {Metadata} from 'next';
import { CustomOrderPage } from '@/floral/Pages';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params;const ko=locale==='ko';
 return {title:(ko?'맞춤 제작 문의':'Custom Floral Inquiry')+' | '+(ko?'티나 플라워':'Tina Flower Atelier'),description:ko?'나만의 꽃 디자인을 문의해 주세요.':'Ask about a bespoke floral composition.',alternates:{canonical:`/${locale}/custom-order`,languages:{en:'/en/custom-order',ko:'/ko/custom-order'}}};
}
export default function Page(){return <CustomOrderPage/>}

import type {Metadata} from 'next';
import { Home } from '@/floral/Home';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params;const ko=locale==='ko';
 return {title:(ko?'티나 플라워':'Tina Flower Atelier')+' | '+(ko?'티나 플라워':'Tina Flower Atelier'),description:ko?'마음을 담은 꽃과 식물 디자인.':'Thoughtful flowers and botanical designs.',alternates:{canonical:`/${locale}`,languages:{en:'/en',ko:'/ko'}}};
}
export default function Page(){return <Home/>}

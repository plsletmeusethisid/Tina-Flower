import type {Metadata} from 'next';
import { CollectionsPage } from '@/floral/Pages';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params;const ko=locale==='ko';
 return {title:(ko?'컬렉션':'Collections')+' | '+(ko?'티나 플라워':'Tina Flower Atelier'),description:ko?'꽃과 식물 선물 컬렉션을 만나보세요.':'Explore floral collections and botanical gifts.',alternates:{canonical:`/${locale}/collections`,languages:{en:'/en/collections',ko:'/ko/collections'}}};
}
export default function Page(){return <CollectionsPage/>}

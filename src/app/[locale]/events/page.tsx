import type {Metadata} from 'next';
import { EventsPage } from '@/floral/Pages';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params;const ko=locale==='ko';
 return {title:(ko?'행사 꽃장식':'Event Styling')+' | '+(ko?'티나 플라워':'Tina Flower Atelier'),description:ko?'소중한 행사를 위한 꽃장식을 소개합니다.':'Floral styling for gatherings and meaningful occasions.',alternates:{canonical:`/${locale}/events`,languages:{en:'/en/events',ko:'/ko/events'}}};
}
export default function Page(){return <EventsPage/>}

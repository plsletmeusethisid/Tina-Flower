'use client';
import {createContext,useContext,useMemo,type ReactNode} from 'react';
export type Locale='en'|'ko';
const LocaleContext=createContext<Locale>('en');
export function LocaleProvider({locale,children}:{locale:Locale;children:ReactNode}){return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>}
export function isLocale(s:string):s is Locale{return s==='en'||s==='ko'}
export function localizedHref(path:string,locale:Locale):string{
 if(/^(https?:|mailto:|tel:)/i.test(path))return path;
 if(path.startsWith('#'))return path;
 return `/${locale}${path.startsWith('/')?path:'/'+path}`;
}
export function useI18n(){
 const locale=useContext(LocaleContext);
 return useMemo(()=>({locale,t:(en:string,ko:string)=>locale==='ko'?ko:en,href:(path:string)=>localizedHref(path,locale)}),[locale]);
}

'use client';
import {useEffect} from 'react';
import {useI18n} from '@/floral/i18n';
export default function Error({error,reset}:{error:Error;reset:()=>void}){const {t}=useI18n();useEffect(()=>{console.error('Page load failed',error.name)},[error]);return <section className="fl-error-page"><h1>{t('Something went wrong.','페이지를 불러올 수 없습니다.')}</h1><button onClick={reset} type="button">{t('Try again','다시 시도')}</button></section>}

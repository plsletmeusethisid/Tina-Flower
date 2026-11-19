'use client';
import Link from 'next/link';
import {useI18n} from '@/floral/i18n';
export default function NotFound(){const {t,href}=useI18n();return <section className="fl-error-page"><h1>{t('Page not found.','페이지를 찾을 수 없습니다.')}</h1><p>{t('The page you requested is unavailable.','요청하신 페이지를 찾을 수 없습니다.')}</p><Link href={href('/')}>{t('Return home','첫 화면으로 돌아가기')} ↗</Link></section>}

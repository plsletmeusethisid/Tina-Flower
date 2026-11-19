'use client';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useI18n} from './i18n';

export function SiteHeader(){
 const {locale,t,href}=useI18n();const pathname=usePathname();
 const [open,setOpen]=useState(false),[scrolled,setScrolled]=useState(false);
 const drawer=useRef<HTMLDivElement>(null);const toggle=useRef<HTMLButtonElement>(null);
 const links=[['/collections',t('Collections','컬렉션')],['/events',t('Events','행사')],['/about',t('Our Studio','스튜디오')],['/contact',t('Contact','문의')]];
 useEffect(()=>{const update=()=>setScrolled(window.scrollY>40);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update)},[]);
 useEffect(()=>{setOpen(false)},[pathname]);
 useEffect(()=>{
  if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  const focused=document.activeElement as HTMLElement|null;
  const focusables=()=>Array.from(drawer.current?.querySelectorAll<HTMLElement>('a,button:not([disabled])')||[]);
  focusables()[0]?.focus();
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false);if(e.key==='Tab'){const all=focusables();if(!all.length)return;if(e.shiftKey&&document.activeElement===all[0]){e.preventDefault();all.at(-1)?.focus()}else if(!e.shiftKey&&document.activeElement===all.at(-1)){e.preventDefault();all[0].focus()}}};
  window.addEventListener('keydown',key);
  return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',key);(focused||toggle.current)?.focus()};
 },[open]);
 const target=locale==='ko'?'en':'ko';const switchedPath=pathname.replace(/^\/(en|ko)(?=\/|$)/,'/'+target);
 const languageButton=<a href={switchedPath} className="fl-language-toggle" hrefLang={target} aria-label={t('Switch to Korean','영어로 전환')} onClick={e=>{e.preventDefault();window.location.assign(switchedPath+window.location.search+window.location.hash)}}><span aria-hidden="true">◎</span>{t('한국어','English')}</a>;
 return <>
  <a className="fl-skip" href="#main-content">{t('Skip to content','본문으로 이동')}</a>
  <header className={'fl-header '+(scrolled?'is-scrolled':'')}><Link className="fl-brand" href={href('/')} aria-label={t('Tina Flower homepage','티나 플라워 첫 화면')}><span className="fl-brand-flower" aria-hidden="true">✳</span>{locale==='ko'?<span>티나 플라워<small>꽃과 식물의 아틀리에</small></span>:<span>TINA <em>FLOWER</em><small>ATELIER</small></span>}</Link>
   <nav className="fl-desktop-nav" aria-label={t('Main navigation','주 메뉴')}>{links.map(([path,label])=><Link href={href(path)} key={path}>{label}</Link>)}</nav>
   {languageButton}
   <Link className="fl-header-order" href={href('/custom-order')}>{t('Custom Order','맞춤 제작 문의')} <span>↗</span></Link>
   <button type="button" ref={toggle} className="fl-menu-toggle" aria-expanded={open} aria-controls="fl-mobile-menu" aria-label={open?t('Close menu','메뉴 닫기'):t('Open menu','메뉴 열기')} onClick={()=>setOpen(!open)}><span/><span/></button>
  </header>
  {open&&<div className="fl-menu-layer" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><div className="fl-mobile-menu" id="fl-mobile-menu" ref={drawer} role="dialog" aria-modal="true" aria-label={t('Mobile navigation','모바일 메뉴')}><div className="fl-mobile-top"><span>{t('TINA FLOWER','티나 플라워')}</span><button type="button" onClick={()=>setOpen(false)} aria-label={t('Close menu','메뉴 닫기')}>✕</button></div>{links.map(([path,label],i)=><Link href={href(path)} key={path} onClick={()=>setOpen(false)}><small>0{i+1}</small>{label}<span>↗</span></Link>)}<Link className="fl-mobile-order" href={href('/custom-order')} onClick={()=>setOpen(false)}>{t('Custom Order','맞춤 제작 문의')} <span>↗</span></Link><a href={switchedPath} className="fl-mobile-lang" onClick={e=>{e.preventDefault();window.location.assign(switchedPath+window.location.search)}}>{t('View in Korean','영어로 보기')} <span>↗</span></a><p>{t('Nature, beautifully composed.','자연을 아름답게 담아냅니다.')}</p></div></div>}
 </>;
}
export function SiteFooter(){const {t,href}=useI18n();return <footer className="fl-footer"><div className="fl-footer-top"><span className="fl-foot-star" aria-hidden="true">✳</span><h2>{t('Every gesture','모든 마음이')}<br/><em>{t('in bloom.','꽃으로 피어납니다.')}</em></h2><Link href={href('/custom-order')}>{t('Begin an inquiry','제작 상담하기')} <span>↗</span></Link></div><div className="fl-footer-bottom"><Link href={href('/')} className="fl-footer-brand">{t('TINA FLOWER','티나 플라워')}<small>{t('ATELIER','꽃과 식물의 아틀리에')}</small></Link><p>{t("Thoughtfully composed floral designs for life's meaningful moments.",'삶의 소중한 순간을 위한 정성스러운 꽃과 식물 디자인.')}</p><nav aria-label={t('Footer navigation','하단 메뉴')}><Link href={href('/collections')}>{t('Collections','컬렉션')}</Link><Link href={href('/events')}>{t('Events','행사')}</Link><Link href={href('/about')}>{t('The Studio','스튜디오')}</Link><Link href={href('/faq')}>{t('FAQ','자주 묻는 질문')}</Link><Link href={href('/contact')}>{t('Contact','문의')}</Link></nav></div><div className="fl-footer-legal"><span>© 2026 {t('Tina Flower Atelier','티나 플라워')}</span><span>{t('Delivery and pricing are confirmed individually.','배송 가능 지역과 가격은 개별 상담을 통해 안내합니다.')}</span><a href="#top">{t('Back to top','맨 위로')} ↑</a></div></footer>}
export function PageHero({eyebrow,title,italic,description}:{eyebrow:string;title:string;italic?:string;description:string}){const {t}=useI18n();return <section className="fl-page-hero"><div className="fl-page-hero-top"><span>{eyebrow}</span><span>✳</span></div><h1>{title} <em>{italic}</em></h1><p>{description}</p><div className="fl-page-hero-bottom"><span>{t('THE FLORAL ATELIER','꽃과 식물의 아틀리에')}</span><span>{t('DESIGNED WITH INTENTION','마음을 담은 디자인')}</span></div></section>}
export function InquiryBanner(){const {locale,t,href}=useI18n();return <section className="fl-inquiry-banner"><div><span className="fl-overline">{t('COMPOSED FOR YOU','당신만을 위한 꽃')}</span><h2>{t('Something uniquely','오직 당신을 위한')} <em>{t('yours.','특별한 꽃.')}</em></h2><p>{t('Share your inspiration, the occasion, and the feeling you would like to create.','소중한 날과 전하고 싶은 마음을 들려주세요. 하나뿐인 작품을 함께 만들어 갑니다.')}</p><Link href={href('/custom-order')}>{t('Start your inquiry','맞춤 제작 상담')} <span>↗</span></Link></div><img src="/images/products/orchid-atelier.webp" alt={locale==='ko'?'분홍빛 난초 장식':'Pink orchid floral arrangement'} loading="lazy"/></section>}

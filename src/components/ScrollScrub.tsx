'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {useI18n} from '@/floral/i18n';
const heroRemote='https://d2ol7oe51mr4n9.cloudfront.net/user_3MHCvg3WmNVPZ7oePdns6p0iGyl/7d71c03d-2380-43a1-83f3-662f4b3bb7a4.mp4';
/** One continuous film, scrubbed forward or backward by vertical scroll. Static poster works without video. */
export function ScrollScrub(){
 const {locale,t,href}=useI18n();
 const section=useRef<HTMLElement>(null),video=useRef<HTMLVideoElement>(null),copy=useRef<HTMLDivElement>(null);
 const [showVideo,setShowVideo]=useState(false);
 const [src,setSrc]=useState(process.env.NEXT_PUBLIC_HERO_VIDEO_URL || heroRemote);
 useEffect(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const dataSaver=Boolean((navigator as Navigator & {connection?:{saveData?:boolean}}).connection?.saveData);
  if(reduce.matches||dataSaver){setShowVideo(false);return}
  setShowVideo(true);
 },[]);
 useEffect(()=>{
  if(!showVideo)return;
  const el=section.current,v=video.current,head=copy.current;
  if(!el||!v)return;
  let raf=0,alive=true,metadata=false;
  const update=()=>{
   raf=0;if(!alive)return;
   const total=Math.max(1,el.offsetHeight-window.innerHeight);
   const p=Math.max(0,Math.min(1,-el.getBoundingClientRect().top/total));
   if(metadata&&Number.isFinite(v.duration)){
    const target=Math.max(0.001,Math.min(v.duration-0.04,v.duration*p));
    if(Math.abs(v.currentTime-target)>0.045)try{v.currentTime=target}catch{}
   }
   if(head){head.style.opacity=String(Math.max(.26,1-Math.max(0,p-.14)*1.05));head.style.transform=`translate3d(0,${Math.round(p*25)}px,0)`}
  };
  const onScroll=()=>{if(!raf)raf=requestAnimationFrame(update)};
  const onReady=()=>{metadata=true;update()};
  const onGesture=()=>{if(metadata){v.play().then(()=>{v.pause();update()}).catch(()=>{})}};
  v.pause();v.addEventListener('loadedmetadata',onReady);window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});window.addEventListener('touchstart',onGesture,{passive:true,once:true});
  update();return()=>{alive=false;cancelAnimationFrame(raf);v.pause();v.removeEventListener('loadedmetadata',onReady);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);window.removeEventListener('touchstart',onGesture)};
 },[showVideo,src]);
 return <section className="fl-hero" ref={section} aria-label={t('Cinematic floral introduction','꽃과 식물의 영상 소개')}>
  <div className="fl-hero-stage"><picture className="fl-hero-poster"><source srcSet="/images/editorial/hero-poster-mobile.webp" media="(max-width: 700px)"/><img src="/images/editorial/hero-poster.webp" alt="" fetchPriority="high"/></picture>
   {showVideo&&<video key={src} ref={video} className="fl-hero-video" muted playsInline preload="auto" poster="/images/editorial/hero-poster.webp" aria-hidden="true" onError={()=>{if(src!=='/videos/hero-fallback.mp4')setSrc('/videos/hero-fallback.mp4');else setShowVideo(false)}}><source src={src} type="video/mp4"/></video>}
   <div className="fl-hero-gradient"/><div className="fl-hero-copy" ref={copy}><h1>{t('Flowers, beautifully considered.','꽃으로 전하는 아름다운 마음.')}</h1><p>{t("Thoughtfully composed floral designs for life's meaningful moments.",'삶의 소중한 순간을 위해 정성껏 완성하는 꽃과 식물 디자인.')}</p><Link className="fl-hero-button" href={href('/collections')}>{t('Explore collections','컬렉션 보기')} <span>↗</span></Link></div>
  </div>
 </section>;
}

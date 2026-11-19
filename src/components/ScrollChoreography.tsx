'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
export function ScrollChoreography(){
 const pathname=usePathname();
 useEffect(()=>{
  let active=true,dispose:undefined|(()=>void);
  async function attach(){
   const [{gsap},{ScrollTrigger}]=await Promise.all([import('gsap'),import('gsap/ScrollTrigger')]);
   if(!active)return;gsap.registerPlugin(ScrollTrigger);
   const mm=gsap.matchMedia();
   mm.add('(prefers-reduced-motion: no-preference)',()=>{
    const ctx=gsap.context(()=>{
     for(const selector of ['.fl-intro-art img','.fl-event-feature>img','.fl-story-image img']){
      const node=document.querySelector(selector);if(node)gsap.fromTo(node,{y:25},{y:-30,ease:'none',scrollTrigger:{trigger:node,start:'top bottom',end:'bottom top',scrub:1}});
     }
     document.querySelectorAll('.fl-product-card,.fl-index-card').forEach((node,i)=>{
      gsap.fromTo(node,{y:24},{y:0,duration:.8,delay:(i%3)*.08,ease:'power2.out',scrollTrigger:{trigger:node,start:'top 93%',once:true}});
     });
    });return()=>ctx.revert();
   });dispose=()=>mm.revert();
  }
  attach();return()=>{active=false;dispose?.()};
 },[pathname]);return null;
}

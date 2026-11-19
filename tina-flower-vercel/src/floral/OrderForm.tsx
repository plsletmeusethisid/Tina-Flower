'use client';
import {useEffect,useState,type FormEvent} from 'react';
import {products,collections,loc} from './catalog';
import {useI18n} from './i18n';
type Status={type:'success'|'error';message:string}|null;
const occasions:[string,string][]=[['Birthday','생일'],['Wedding','결혼식'],['Anniversary','기념일'],['Celebration','축하'],['Corporate Event','기업 행사'],['Event Styling','행사 꽃장식'],['Weddings','결혼식 장식'],['Celebrations','축하 행사'],['Corporate Florals','기업 행사 꽃장식'],['Custom Installations','맞춤 공간 장식'],['Other','기타']];
const budgets:[string,string][]=[['Modest arrangement','소규모 꽃장식'],['Mid-range arrangement','중간 규모 꽃장식'],['Statement arrangement','대형 꽃장식'],['Large-scale installation','대규모 공간 장식'],['Prefer to discuss','상담 후 결정']];
export function OrderForm(){
 const {locale,t}=useI18n();
 const [initialProduct,setInitialProduct]=useState(''),[initialOccasion,setInitialOccasion]=useState('');
 const [status,setStatus]=useState<Status>(null),[pending,setPending]=useState(false);
 useEffect(()=>{const qs=new URLSearchParams(window.location.search);setInitialProduct(qs.get('product')||'');setInitialOccasion(qs.get('occasion')||'')},[]);
 async function send(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(pending)return;const f=e.currentTarget;
  const values=Object.fromEntries(new FormData(f).entries());
  const payload={...values,locale,consent:values.consent==='on'};
  setPending(true);setStatus(null);
  try{
   const response=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   const result=await response.json().catch(()=>({error:t('An unexpected response occurred.','서버에서 예상치 못한 응답을 받았습니다.')}));
   if(!response.ok){setStatus({type:'error',message:result.error||t('The inquiry could not be delivered. Please try again.','문의 내용을 전달하지 못했습니다. 다시 시도해 주세요.')});return}
   setStatus({type:'success',message:t('Your inquiry was received for the studio to review. This does not confirm an order or delivery date.','문의 내용이 정상적으로 접수되었습니다. 주문이나 배송 일정이 확정된 것은 아닙니다.')});f.reset();
  }catch{setStatus({type:'error',message:t('Unable to reach the inquiry service. No request was sent. Please try again later.','문의 서비스에 연결할 수 없어 내용이 전송되지 않았습니다. 잠시 후 다시 시도해 주세요.')})}
  finally{setPending(false)}
 }
 return <form className="fl-order-form" onSubmit={send}>
  <div className="fl-field"><label htmlFor="fl-name">{t('Your name','이름')} *</label><input id="fl-name" name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder={t('Full name','성함을 입력해 주세요')}/></div>
  <div className="fl-field"><label htmlFor="fl-email">{t('Email address','이메일 주소')} *</label><input id="fl-email" name="email" type="email" required maxLength={200} autoComplete="email" placeholder={t('you@example.com','이메일 주소를 입력해 주세요')}/></div>
  <div className="fl-field"><label htmlFor="fl-phone">{t('Phone (optional)','전화번호 (선택)')}</label><input id="fl-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" placeholder={t('Contact number','연락처를 입력해 주세요')}/></div>
  <div className="fl-field"><label htmlFor="fl-occasion">{t('Occasion','행사 목적')} *</label><select key={initialOccasion||'none'} id="fl-occasion" name="occasion" defaultValue={occasions.some(x=>x[0]===initialOccasion)?initialOccasion:''} required><option value="" disabled>{t('Select an occasion','행사 목적을 선택해 주세요')}</option>{occasions.map(([value,ko])=><option value={value} key={value}>{locale==='ko'?ko:value}</option>)}</select></div>
  <div className="fl-field"><label htmlFor="fl-type">{t('Arrangement category','꽃장식 종류')} *</label><select id="fl-type" name="category" required defaultValue=""><option value="" disabled>{t('Choose a collection','컬렉션을 선택해 주세요')}</option>{collections.map(x=><option key={x.slug} value={x.slug}>{loc(x,'name',locale)}</option>)}<option value="not-sure">{t('Not sure yet','아직 결정하지 못했어요')}</option></select></div>
  <div className="fl-field"><label htmlFor="fl-product">{t('An arrangement you like','마음에 드는 작품')}</label><select key={initialProduct||'none'} id="fl-product" name="product" defaultValue={products.some(x=>x.slug===initialProduct)?initialProduct:''}><option value="">{t('Not decided','아직 선택하지 않았어요')}</option>{products.map(x=><option value={x.slug} key={x.slug}>{loc(x,'name',locale)}</option>)}</select></div>
  <div className="fl-field"><label htmlFor="fl-date">{t('Preferred date','희망 날짜')}</label><input id="fl-date" name="desiredDate" type="date"/><small>{t('Dates and availability are confirmed separately.','제작 가능 날짜는 상담 후 확정됩니다.')}</small></div>
  <div className="fl-field"><label htmlFor="fl-budget">{t('Approximate budget','예상 예산')} *</label><select id="fl-budget" name="budget" required defaultValue=""><option value="" disabled>{t('Choose a range','예산 범위를 선택해 주세요')}</option>{budgets.map(([value,ko])=><option key={value} value={value}>{locale==='ko'?ko:value}</option>)}</select></div>
  <div className="fl-field fl-field-wide"><label htmlFor="fl-notes">{t('Tell us your vision','원하시는 디자인을 알려주세요')} *</label><textarea id="fl-notes" name="instructions" required minLength={10} maxLength={3000} placeholder={t('Tell us about the occasion, colors, favorite flowers, or special details.','행사 목적과 원하는 색감, 좋아하는 꽃, 특별히 요청할 사항을 적어 주세요.')}/></div>
  <div className="fl-honeypot" aria-hidden="true"><label htmlFor="fl-website">{t('Website','웹사이트')}</label><input id="fl-website" name="website" tabIndex={-1} autoComplete="off"/></div>
  <label className="fl-consent"><input required name="consent" type="checkbox"/><span>{t('I agree to have these details stored and used to respond to my floral inquiry.','문의 내용을 확인하고 회신하는 데 필요한 정보의 수집 및 이용에 동의합니다.')} *</span></label>
  {status&&<div className={'fl-form-status fl-form-'+status.type} role="status" aria-live="polite">{status.message}</div>}
  <div className="fl-submit"><span>{t('* REQUIRED INFORMATION','* 필수 입력 사항')}</span><button disabled={pending} type="submit">{pending?t('Sending request...','문의 접수 중...'):t('Send inquiry','문의 접수하기')} <span aria-hidden="true">↗</span></button></div>
 </form>;
}

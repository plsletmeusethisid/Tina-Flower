import {NextResponse,type NextRequest} from 'next/server';
import {z} from 'zod';
import {products,collections} from '@/floral/catalog';
export const runtime='nodejs';
const schema=z.object({
 name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(200),phone:z.string().trim().max(40).optional().default(''),
 occasion:z.string().trim().min(1).max(100),category:z.string().trim().min(1).max(100),product:z.string().max(100).optional().default(''),
 desiredDate:z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/).optional().default(''),budget:z.string().min(1).max(100),
 instructions:z.string().trim().min(10).max(3000),website:z.string().max(100).optional().default(''),consent:z.literal(true),locale:z.enum(['en','ko'])
}).strict();
type Submission=z.infer<typeof schema>;
const localRecent=new Map<string,{count:number;until:number}>();
async function allowed(ip:string):Promise<boolean>{
 const url=process.env.UPSTASH_REDIS_REST_URL,token=process.env.UPSTASH_REDIS_REST_TOKEN;
 if(url&&token){
  try{const key='floral-inquiries:'+ip;const r=await fetch(url.replace(/\/$/,'')+'/pipeline',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify([['INCR',key],['EXPIRE',key,3600]]),cache:'no-store'});if(!r.ok)return false;const data=await r.json() as Array<{result?:number}>;return Number(data[0]?.result)<=5}catch{return false}
 }
 // Local development fallback only. Production should configure Upstash for shared limits.
 const now=Date.now();for(const [key,v] of localRecent)if(v.until<now)localRecent.delete(key);
 const x=localRecent.get(ip);if(!x||x.until<now){localRecent.set(ip,{count:1,until:now+3600000});return true}
 if(x.count>=5)return false;x.count++;return true;
}
async function sendEmail(d:Submission):Promise<boolean>{
 const api=process.env.RESEND_API_KEY,from=process.env.INQUIRY_FROM_EMAIL,to=process.env.INQUIRY_TO_EMAIL;
 if(!api||!from||!to)return false;
 const text=[`Name: ${d.name}`,`Email: ${d.email}`,`Phone: ${d.phone||'-'}`,`Occasion: ${d.occasion}`,`Category: ${d.category}`,`Product: ${d.product||'-'}`,`Date: ${d.desiredDate||'-'}`,`Budget: ${d.budget}`,`Language: ${d.locale}`,`Instructions:\n${d.instructions}`].join('\n\n');
 try{const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+api,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:d.email,subject:`Tina Flower inquiry: ${d.occasion}`,text}),cache:'no-store',signal:AbortSignal.timeout(12000)});if(!response.ok){console.error('Resend request failed',response.status);return false}return true}catch{return false}
}
async function saveSupabase(d:Submission):Promise<boolean>{
 const base=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!base||!key)return false;
 const record={name:d.name,email:d.email,phone:d.phone,occasion:d.occasion,category:d.category,product:d.product,desired_date:d.desiredDate||null,budget:d.budget,instructions:d.instructions,locale:d.locale};
 try{const r=await fetch(base.replace(/\/$/,'')+'/rest/v1/floral_inquiries',{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(record),cache:'no-store',signal:AbortSignal.timeout(12000)});if(!r.ok){console.error('Supabase request failed',r.status);return false}return true}catch{return false}
}
export async function POST(req:NextRequest){
 let locale:'en'|'ko'='en';
 const err=(en:string,ko:string,status:number)=>NextResponse.json({error:locale==='ko'?ko:en},{status,headers:{'Cache-Control':'no-store'}});
 if(!req.headers.get('content-type')?.includes('application/json'))return err('Please use the inquiry form.','문의 양식을 통해 접수해 주세요.',415);
 let raw:unknown;try{const txt=await req.text();if(txt.length>16000)return err('Your message is too long.','입력한 내용이 너무 깁니다.',413);raw=JSON.parse(txt);if(raw&&typeof raw==='object'&&'locale' in raw&&raw.locale==='ko')locale='ko';}catch{return err('Please check your form information.','입력한 내용을 다시 확인해 주세요.',400)}
 const parsed=schema.safeParse(raw);if(!parsed.success)return err('Check the required fields and try again.','필수 입력 항목과 내용을 확인해 주세요.',400);
 const d=parsed.data;if(d.website)return err('Unable to process this request.','요청을 처리할 수 없습니다.',400);
 if(!collections.some(x=>x.slug===d.category)&&d.category!=='not-sure')return err('Select a valid category.','올바른 종류를 선택해 주세요.',400);
 if(d.product&&!products.some(x=>x.slug===d.product))return err('Select a valid arrangement.','올바른 작품을 선택해 주세요.',400);
 const emailReady=!!(process.env.RESEND_API_KEY&&process.env.INQUIRY_FROM_EMAIL&&process.env.INQUIRY_TO_EMAIL);
 const dbReady=!!(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY);
 if(!emailReady&&!dbReady)return err('Inquiries are not configured. No message was sent or saved.','문의 서비스가 아직 설정되지 않아 내용이 전송되거나 저장되지 않았습니다.',503);
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';if(!await allowed(ip))return err('Too many inquiries. Please try again later.','문의 접수 횟수가 너무 많습니다. 잠시 후 다시 시도해 주세요.',429);
 const [saved,emailed]=await Promise.all([dbReady?saveSupabase(d):Promise.resolve(false),emailReady?sendEmail(d):Promise.resolve(false)]);
 if(!saved&&!emailed)return err('The inquiry could not be delivered. Please try again later.','문의 내용을 전달하지 못했습니다. 잠시 후 다시 시도해 주세요.',503);
 return NextResponse.json({ok:true,delivery:{saved,emailed}},{status:201,headers:{'Cache-Control':'no-store'}});
}

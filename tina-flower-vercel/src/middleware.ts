import {NextResponse,type NextRequest} from 'next/server';
export function middleware(request:NextRequest){
 const path=request.nextUrl.pathname;
 if(/^\/(en|ko)(\/|$)/.test(path))return NextResponse.next();
 const dest=request.nextUrl.clone();
 const locale=dest.searchParams.get('lang')==='ko'?'ko':'en';
 dest.searchParams.delete('lang');
 dest.pathname=`/${locale}${path==='/'?'':path}`;
 return NextResponse.redirect(dest,307);
}
export const config={matcher:['/((?!api|_next|images|videos|favicon.ico|apple-touch-icon.png|.*\\..*).*)']};

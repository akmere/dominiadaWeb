// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// export { default } from "next-auth/middleware"

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   console.log('WTFWERFSDAFSDAFSDA');
//   return NextResponse.redirect(new URL('/faq', request.url))
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: ['/admin/:path*'],
// }

export { default } from "next-auth/middleware"

export const config = { matcher: ["/admin/:path*","/api/admin/:path*"] }
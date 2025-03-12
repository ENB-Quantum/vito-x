// middleware.ts
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Define public paths that don't require authentication
    const isPublicPath = path === '/' || path === '/login'
    
    // Get the token and check if the user is authenticated
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    // Redirect logic for public paths
    if (isPublicPath) {
        // If user is already logged in and tries to access auth pages,
        // redirect them to dashboard
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        // If not logged in, allow access to public paths
        return NextResponse.next()
    }

    // Protect all other routes
    if (!token) {
        // Save the current path the user was trying to visit
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('callbackUrl', path)
        return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|Image|songs).*)',
    ]
}
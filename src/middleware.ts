import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    constsupabase = createMiddlewareClient({ req, res })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Protected routes
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
        if (!session) {
            return NextResponse.redirect(new URL('/auth/login', req.url))
        }

        // Role-based access control (Basic check, verified deeper in layout/page)
        // We can add more strict checks here if we query profiles, but for performance 
        // we often rely on RLS and client-side checks for the UI, 
        // or use custom claims if set up.
        // For MVP, we'll let the layout handle the specific role redirect 
        // if a vendor tries to access customer dashboard, etc.
    }

    // Auth routes (redirect if already logged in)
    if (req.nextUrl.pathname.startsWith('/auth')) {
        if (session) {
            // Logic to redirect based on role would need profile fetch, 
            // but middleware is edge. 
            // We'll just default to home or a generic dashboard redirector if needed.
            // For now, let them access auth pages (maybe they want to switch accounts)
            // or redirect to home.
            // return NextResponse.redirect(new URL('/dashboard/customer', req.url))
        }
    }

    return res
}

export const config = {
    matcher: ['/dashboard/:path*', '/auth/:path*'],
}

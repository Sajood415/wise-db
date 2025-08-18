import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicPaths = [
        '/',
        '/login',
        '/signup',
        '/about',
        '/help',
        '/how-it-works',
        '/services',
        '/report-fraud',
        '/enterprise',
        '/privacy',
        '/terms',
        '/contact',
        '/docs',
        '/api-docs',
        '/forgot-password',
        '/api/auth/login',
        '/api/auth/signup',
        '/api/fraud'
    ];

    // Check if the current path is public
    const isPublicPath = publicPaths.some(path =>
        pathname === path || pathname.startsWith(path + '/')
    );

    // Skip authentication for public paths and static files
    if (isPublicPath || pathname.startsWith('/_next') || pathname.startsWith('/api/public')) {
        return NextResponse.next();
    }

    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;

    // Redirect to login if no token
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        // Verify JWT token using jose (Edge Runtime compatible)
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key');
        const { payload: decoded } = await jwtVerify(token, secret);

        // Role-based access control
        const userRole = decoded.role as string;

        // Super admin routes
        if (pathname.startsWith('/admin') && userRole !== 'super_admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        // Enterprise admin routes - none gated at /enterprise (public landing/form)

        // Sub admin routes
        if (pathname.startsWith('/manage') &&
            !['sub_admin', 'enterprise_admin', 'super_admin'].includes(userRole)) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        // Add user info to headers for API routes
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', decoded.userId as string);
        requestHeaders.set('x-user-email', decoded.email as string);
        requestHeaders.set('x-user-role', decoded.role as string);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

    } catch (error) {
        console.error('Token verification failed:', error);
        // Invalid token, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('auth-token');
        return response;
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
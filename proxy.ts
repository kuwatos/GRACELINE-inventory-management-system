import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateSessionUser } from '@/src/entity/user/user.repository'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let user = null;

  try {
    // Attempt to get the user
    user = await validateSessionUser();
  } catch (error) {
    // If it throws "No session", we just keep user as null
    console.log("No active session found (normal for login/public routes)");
  }

  // 1. If user IS logged in and trying to access login page, send them to their dashboard
  if (pathname.startsWith('/login') && user) {
    const department = user.department.toLowerCase();
    // Use NextResponse.redirect here!
    return NextResponse.redirect(new URL(`/${department}/dashboard`, request.url));
  }

  // 2. If user is NOT logged in and trying to access protected routes
  if (!user && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Departmental Access Control (Only if user exists)
  if (user) {
    const department = user.department.toLowerCase();
    
    // Check if they are trying to access a department that isn't theirs
    // Example: Admin trying to access /finance
    const departments = ['admin', 'purchasing', 'warehouse', 'finance'];
    const isAccessingOtherDept = departments.some(dept => 
      pathname.startsWith(`/${dept}`) && dept !== department
    );

    if (isAccessingOtherDept || pathname === '/') {
       return NextResponse.redirect(new URL(`/${department}/dashboard`, request.url));
    }
  }

  return NextResponse.next();
}

// 4. CRITICAL: Add '/login' to the matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - next-js-server-action (Internal Server Action calls)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-action' }, // 👈 THIS IS THE SECRET SAUCE
      ],
    },
  ],
};
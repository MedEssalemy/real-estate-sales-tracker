import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect logic
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/reset-password',
    '/',
    '/features',
    '/pricing',
    '/contact',
    '/about',
    '/privacy',
    '/terms',
  ]

  // Redirect to login if not authenticated and trying to access protected route
  if (!session && !publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // If user is authenticated, check for their setup status and agency membership
  if (session) {
    try {
      const { data: userData } = await supabase
        .from('auth.users')
        .select('raw_user_meta_data')
        .eq('id', session.user.id)
        .single()

      const userSetupComplete =
        userData?.raw_user_meta_data?.setup_complete || false

      // Check if user is associated with an agency
      const { data: agencyUser } = await supabase
        .from('agency_users')
        .select('agency_id, role')
        .eq('user_id', session.user.id)
        .single()

      // If user is not associated with an agency and marked as agency_admin or agency_agent,
      // redirect to agency setup if not already there
      const userRole = session.user.user_metadata.role

      if (
        !agencyUser &&
        (userRole === 'agency_admin' || userRole === 'agency_agent') &&
        req.nextUrl.pathname !== '/agency/setup' &&
        !userSetupComplete
      ) {
        return NextResponse.redirect(new URL('/agency/setup', req.url))
      }

      // If user is an individual agent and setup is not complete,
      // redirect to profile setup if not already there
      if (
        !userSetupComplete &&
        userRole === 'individual_agent' &&
        req.nextUrl.pathname !== '/profile/setup'
      ) {
        return NextResponse.redirect(new URL('/profile/setup', req.url))
      }
    } catch (error) {
      // If there's an error, we'll continue without redirection
      console.error('Middleware error:', error)
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
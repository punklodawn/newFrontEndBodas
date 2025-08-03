import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_EMAIL = 'miguelmansillarev22@gmail.com'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  // Obtener sesión
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error obteniendo sesión:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const isAdmin = session?.user?.email === ADMIN_EMAIL
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/login'

  // Redirecciones
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoginRoute && isAdmin) {
    return NextResponse.redirect(new URL('/admin/panel', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
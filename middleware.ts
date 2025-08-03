import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_EMAIL = 'miguelmansillarev22@gmail.com'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  // Forzar sincronización de cookies
  await supabase.auth.getSession()

  const { data: { session } } = await supabase.auth.getSession()
  
  const isAdmin = session?.user?.email === ADMIN_EMAIL
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/login'

  // Redirigir si no es admin en ruta admin
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirigir si es admin y está en login
  if (isLoginRoute && isAdmin) {
    return NextResponse.redirect(new URL('/admin/panel', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
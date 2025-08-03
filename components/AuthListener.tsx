'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/supabase/supabase'

const ADMIN_EMAIL = 'miguelmansillarev22@gmail.com'

export default function AuthListener() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Solo se ejecuta en el cliente
    if (typeof window === 'undefined') return

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const isAdmin = session?.user?.email === ADMIN_EMAIL
      const isAdminRoute = pathname?.startsWith('/admin')

      if (isAdminRoute && !isAdmin) {
        router.push('/login')
      } else if (pathname === '/login' && isAdmin) {
        router.push('/admin/panel')
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const isAdmin = session?.user?.email === ADMIN_EMAIL
        const isAdminRoute = pathname?.startsWith('/admin')

        if (['SIGNED_IN', 'TOKEN_REFRESHED'].includes(event)) {
          if (isAdmin && pathname === '/login') {
            router.push('/admin/panel')
          }
        } else if (event === 'SIGNED_OUT' && isAdminRoute) {
          router.push('/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, pathname])

  return null
}
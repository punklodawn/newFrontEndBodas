// components/AuthListener.tsx
'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/supabase/supabase'

export default function AuthListener() {
  const router = useRouter()
  const pathname = usePathname()

 useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Función para obtener email compatible
      const getEmail = () => session?.user?.email || session?.email

      if (['SIGNED_IN', 'TOKEN_REFRESHED'].includes(event)) {
        if (getEmail() === 'miguelmansillarev22@gmail.com') {
          // Forzar sincronización
          await supabase.auth.getSession()
          
          // Redirigir si está en login
          if (pathname === '/login') {
            router.push('/admin/panel')
          }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [router, pathname])

  return null
}
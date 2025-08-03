// components/SessionHandler.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabase/supabase'

export default function SessionHandler() {
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email === 'miguelmansillarev22@gmail.com') {
        // Forzar actualización de la sesión
        await supabase.auth.getSession()
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return null
}
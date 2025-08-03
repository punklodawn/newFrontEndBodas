'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabase/supabase'

const ADMIN_EMAIL = 'miguelmansillarev22@gmail.com'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session || session.user?.email !== ADMIN_EMAIL) {
        router.push('/login')
      } else {
        setIsAuthorized(true)
      }
    }

    checkAuth()
  }, [router])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}
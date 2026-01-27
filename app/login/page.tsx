// app/login/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabase/supabase'

// Lista de administradores autorizados
const AUTHORIZED_ADMINS = [
  'miguelmansillarev22@gmail.com',
  'liliandvl01@gmail.com',
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user?.email && AUTHORIZED_ADMINS.includes(session.user.email)) {
        setTimeout(() => router.push('/admin/panel'), 500)
      } else {
        setLoading(false)
      }
    }
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email) {
        if (AUTHORIZED_ADMINS.includes(session.user.email)) {
          router.push('/admin/panel')
        } else {
          await supabase.auth.signOut()
          setError('Acceso restringido a administradores')
          setLoading(false)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSent(false)

    // Validar email
    if (!email.includes('@') || !email.includes('.')) {
      setError('Por favor ingresa un email válido')
      return
    }

    // Verificar si está autorizado
    if (!AUTHORIZED_ADMINS.includes(email)) {
      setError('Acceso restringido a administradores autorizados')
      return
    }

    try {
      // IMPORTANTE: Esto creará el usuario si no existe
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/panel`,
          shouldCreateUser: true // ← ESTO ES CLAVE: Permite crear usuarios
        }
      })

      if (error) {
        // Manejo de errores específicos
        if (error.message.includes('Signups not allowed')) {
          setError(`
            Registro no permitido. Necesitas:
            1. Ir a Supabase Dashboard
            2. Authentication → Providers → Email
            3. Activar "Confirm email"
            4. Guardar cambios
          `)
        } else if (error.message.includes('rate limit')) {
          setError('Demasiados intentos. Por favor espera unos minutos.')
        } else {
          setError(error.message)
        }
      } else {
        setSent(true)
      }
    } catch (err) {
      setError('Ocurrió un error inesperado.')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">Panel de Administración</h1>
        
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <p className="font-medium">Magic Link para todos los administradores</p>
          <p className="mt-1">El sistema creará automáticamente nuevos usuarios.</p>
        </div>

        <form onSubmit={handleLogin} className="mb-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email de administrador
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-2 disabled:opacity-50"
            disabled={sent}
          >
            {sent ? 'Link enviado ✓' : 'Enviar Magic Link'}
          </button>

          {sent && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-700 text-sm">
                ✓ Magic Link enviado a <strong>{email}</strong>
              </p>
              <p className="text-green-600 text-xs mt-1">
                • Si ya eres usuario: inicia sesión normalmente
                <br/>
                • Si eres nuevo: se creará tu cuenta automáticamente
                <br/>
                • Revisa bandeja de entrada y spam
                <br/>
                • El link expira en 24 horas
              </p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-700 text-sm whitespace-pre-line">✗ {error}</p>
            </div>
          )}
        </form>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600 mb-2">Administradores autorizados:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            {AUTHORIZED_ADMINS.map((adminEmail, index) => (
              <li key={index} className={`truncate ${adminEmail === 'miguelmansillarev22@gmail.com' ? 'font-medium' : ''}`}>
                • {adminEmail}
                {adminEmail === 'miguelmansillarev22@gmail.com' && ' (Principal)'}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-gray-400 text-center mt-4">
          <p>Todos los administradores usan Magic Link para acceder.</p>
          <p className="mt-1">Nuevos usuarios se crean automáticamente al primer login.</p>
        </div>
      </div>
    </div>
  )
}
// app/login/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabase/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // Verificación manual con botón
  const checkSessionManually = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email === 'miguelmansillarev22@gmail.com') {
        router.push('/admin/panel')
      } else {
        setError('No se encontró sesión activa.')
      }
    } catch (err) {
      setError('Error al verificar sesión.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Verificación inicial simple (solo para mostrar el formulario rápidamente)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500) // Espera corta para mostrar el formulario

    return () => clearTimeout(timer)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSent(false)

    if (!email) {
      setError('Por favor ingresa un email.')
      return
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/panel`
        }
      })

      if (error) {
        setError(error.message)
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
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Iniciar sesión</h1>
        
        <input
          type="email"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-2"
        >
          Enviar Magic Link
        </button>

        {/* Botón para verificar sesión manualmente */}
        <button
          type="button"
          onClick={checkSessionManually}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition mb-4"
        >
          Verificar Sesión y Redirigir
        </button>

        {sent && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700">✓ Revisa tu correo para continuar.</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700">✗ {error}</p>
          </div>
        )}
      </form>
    </div>
  )
}
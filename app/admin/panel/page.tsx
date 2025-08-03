// app/admin/panel/page.tsx
'use client'
import { Fragment, useState, useEffect } from 'react'
import { supabase } from '@/supabase/supabase'
import { useRouter } from 'next/navigation'
import AdminGuard from '@/components/AdminGuard'


interface MainGuest {
  id?: number;  // id es opcional porque se asigna al insertar en BD
  name: string;
  email?: string | null;
  code: string;
}

interface CompanionGuest {
  id: number
  main_guest_id: number
  name: string
  is_adult: boolean
  is_attending: boolean | null
}

export default function AdminPanel() {
    const router = useRouter()
  const [mainGuest, setMainGuest] = useState<MainGuest>({
    name: '',
    email: '',
    code: ''
  })
  
  const [companions, setCompanions] = useState<CompanionGuest[]>([
    { name: '', is_adult: true, main_guest_id: 0, id: 0, is_attending: null }
  ])
  
  const [guestsList, setGuestsList] = useState<(MainGuest & { companions: CompanionGuest[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [expandedGuests, setExpandedGuests] = useState<Record<number, boolean>>({})


    useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email !== 'miguelmansillarev22@gmail.com') {
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  // Cargar lista de invitados y sus acompañantes al montar el componente
  useEffect(() => {
    loadGuestsWithCompanions()
  }, [])

  const loadGuestsWithCompanions = async () => {
    try {
      setLoading(true)
      
      // 1. Cargar todos los invitados principales
      const { data: mainGuestsData, error: mainGuestsError } = await supabase
        .from('main_guests')
        .select('*')
        .order('id', { ascending: false })

      if (mainGuestsError) throw mainGuestsError

      // 2. Cargar todos los acompañantes
      const { data: allCompanionsData, error: companionsError } = await supabase
        .from('companion_guests')
        .select('*')

      if (companionsError) throw companionsError

      // 3. Combinar los datos
      const guestsWithCompanions = mainGuestsData?.map(guest => ({
        ...guest,
        companions: allCompanionsData?.filter(comp => comp.main_guest_id === guest.id) || []
      })) || []

      setGuestsList(guestsWithCompanions)
    } catch (error) {
      console.error('Error loading guests:', error)
      setMessage({ type: 'error', text: 'Error al cargar la lista de invitados' })
    } finally {
      setLoading(false)
    }
  }

  const handleMainGuestChange = (field: keyof MainGuest, value: string) => {
    setMainGuest(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCompanionChange = (index: number, field: keyof CompanionGuest, value: string | boolean) => {
    const updated = [...companions]
    updated[index] = { ...updated[index], [field]: value }
    setCompanions(updated)
  }

  const addCompanion = () => {
    setCompanions([...companions, { 
      name: '', 
      is_adult: true, 
      main_guest_id: 0, 
      id: 0, 
      is_attending: null 
    }])
  }

  const removeCompanion = (index: number) => {
    if (companions.length > 1) {
      const updated = [...companions]
      updated.splice(index, 1)
      setCompanions(updated)
    }
  }

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setMainGuest(prev => ({ ...prev, code: result }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // Validación básica
    if (!mainGuest.name || !mainGuest.code) {
      setMessage({ type: 'error', text: 'Por favor complete nombre y código' })
      return
    }

    try {
      // 1. Insertar invitado principal
      const { data: mainGuestData, error: mainGuestError } = await supabase
        .from('main_guests')
        .insert([{
          name: mainGuest.name,
          email: mainGuest.email || null,
          code: mainGuest.code
        }])
        .select()
        .single()

      if (mainGuestError) throw mainGuestError

      // 2. Insertar acompañantes si existen
      if (companions.some(c => c.name.trim() !== '')) {
        const companionsToInsert = companions
          .filter(c => c.name.trim() !== '')
          .map(c => ({
            name: c.name,
            is_adult: c.is_adult,
            main_guest_id: mainGuestData.id,
            is_attending: null
          }))

        if (companionsToInsert.length > 0) {
          const { error: companionsError } = await supabase
            .from('companion_guests')
            .insert(companionsToInsert)

          if (companionsError) throw companionsError
        }
      }

      // 3. Limpiar formulario y mostrar mensaje
      setMainGuest({
        name: '',
        email: '',
        code: ''
      })
      setCompanions([{ 
        name: '', 
        is_adult: true, 
        main_guest_id: 0, 
        id: 0, 
        is_attending: null 
      }])
      
      setMessage({ type: 'success', text: 'Invitado registrado correctamente' })
      loadGuestsWithCompanions() // Recargar la lista completa
      
    } catch (error) {
      console.error('Error registering guest:', error)
      setMessage({ type: 'error', text: 'Error al registrar el invitado' })
    }
  }

  const toggleGuestExpansion = (guestId: number) => {
    setExpandedGuests(prev => ({
      ...prev,
      [guestId]: !prev[guestId]
    }))
  }

  return (
        <AdminGuard>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      
      {/* Formulario para registrar invitados */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Registrar Nuevo Invitado</h2>
        
        {message && (
          <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Invitado Principal</label>
              <input
                type="text"
                value={mainGuest.name}
                onChange={(e) => handleMainGuestChange('name', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código de Invitación</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mainGuest.code}
                  onChange={(e) => handleMainGuestChange('code', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  required
                />
                <button
                  type="button"
                  onClick={generateCode}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Generar
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opcional)</label>
            <input
              type="email"
              value={mainGuest.email || ''}
              onChange={(e) => handleMainGuestChange('email', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          {/* Sección de acompañantes */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Acompañantes</label>
              <button
                type="button"
                onClick={addCompanion}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                + Agregar
              </button>
            </div>
            
            <div className="space-y-2">
              {companions.map((companion, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Nombre del acompañante"
                    value={companion.name}
                    onChange={(e) => handleCompanionChange(index, 'name', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded"
                  />
                  <select
                    value={companion.is_adult ? 'adult' : 'child'}
                    onChange={(e) => handleCompanionChange(index, 'is_adult', e.target.value === 'adult')}
                    className="p-2 border border-gray-300 rounded"
                  >
                    <option value="adult">Adulto</option>
                    <option value="child">Niño</option>
                  </select>
                  {companions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCompanion(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Registrar Invitado
          </button>
        </form>
      </div>
      
      {/* Lista de invitados registrados con sus acompañantes */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Invitados Registrados</h2>
        
        {loading ? (
          <p>Cargando lista de invitados...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acompañantes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {guestsList.map((guest) => (
                  <Fragment key={guest.id}>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{guest.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {guest.companions.length} acompañante(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {guest.id !== undefined ? (
                                <button
                                    onClick={() => toggleGuestExpansion(guest.id!)} // Usamos el operador ! para afirmar que no es undefined
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    {expandedGuests[guest.id] ? 'Ocultar' : 'Ver'} detalles
                                </button>
                                ) : (
                                <span className="text-gray-400">No disponible</span>
                                )}
                      </td>
                    </tr>
                    {guest.id !== undefined && expandedGuests[guest.id] && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Lista de Acompañantes:</h4>
                            {guest.companions.length > 0 ? (
                              <ul className="list-disc list-inside space-y-1">
                                {guest.companions.map((companion) => (
                                  <li key={companion.id} className="text-gray-700">
                                    {companion.name} 
                                    <span className="text-gray-500 text-sm ml-2">
                                      ({companion.is_adult ? 'Adulto' : 'Niño'})
                                    </span>
                                    {companion.is_attending !== null && (
                                      <span className={`ml-2 text-sm ${companion.is_attending ? 'text-green-600' : 'text-red-600'}`}>
                                        ({companion.is_attending ? 'Confirmado' : 'No asistirá'})
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500">No hay acompañantes registrados</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
            
            {guestsList.length === 0 && (
              <p className="text-center py-4 text-gray-500">No hay invitados registrados aún</p>
            )}
          </div>
        )}
      </div>
    </div>
    </AdminGuard>
  )
}
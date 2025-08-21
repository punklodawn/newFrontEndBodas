'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Eye, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/supabase/supabase'

interface Photo {
  id: string
  created_at: string
  guest_name: string
  image_url: string
  status: 'pending' | 'approved' | 'rejected'
  moderated_at: string | null
  moderated_by: string | null
}

export default function PhotoModerationPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    fetchPhotos()
  }, [filter])

  const fetchPhotos = async () => {
    try {
      let query = supabase
        .from('wedding_photos')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching photos:', error)
      } else {
        setPhotos(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const moderatePhoto = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('wedding_photos')
        .update({ 
          status,
          moderated_at: new Date().toISOString(),
          moderated_by: 'admin' // En una implementación real, usarías el usuario autenticado
        })
        .eq('id', id)

      if (error) {
        console.error('Error moderating photo:', error)
      } else {
        // Actualizar la lista localmente
        setPhotos(prev => prev.filter(photo => photo.id !== id))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const filteredPhotos = filter === 'all' 
    ? photos 
    : photos.filter(photo => photo.status === filter)

  return (
    <div className="min-h-screen bg-nature-cream py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">
            Moderación de Fotos
          </h1>
          <p className="text-lg text-nature-green">
            Gestiona las fotos subidas por los invitados
          </p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-nature-sage mb-8">
          <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
            <h2 className="text-xl font-bold">Filtros</h2>
          </div>
          
          <div className="p-4 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full ${
                filter === 'all' 
                  ? 'bg-nature-green text-white' 
                  : 'bg-gray-100 text-nature-green'
              }`}
            >
              Todas ({photos.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-full ${
                filter === 'pending' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-100 text-nature-green'
              }`}
            >
              Pendientes ({photos.filter(p => p.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-full ${
                filter === 'approved' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-nature-green'
              }`}
            >
              Aprobadas ({photos.filter(p => p.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-full ${
                filter === 'rejected' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-nature-green'
              }`}
            >
              Rechazadas ({photos.filter(p => p.status === 'rejected').length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 text-nature-green animate-spin" />
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-nature-sage">
            <p className="text-nature-green text-lg">
              {filter === 'pending' 
                ? 'No hay fotos pendientes de moderación' 
                : `No hay fotos ${filter === 'all' ? '' : filter}`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-nature-sage"
              >
                <div className="relative aspect-square">
                  <Image
                    src={photo.image_url}
                    alt={`Foto de ${photo.guest_name}`}
                    fill
                    className="object-cover"
                    onClick={() => setPreviewImage(photo.image_url)}
                  />
                  
                  {photo.status === 'pending' && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                      Pendiente
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <p className="text-nature-green font-medium mb-2">
                    Subido por: {photo.guest_name || 'Anónimo'}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    {new Date(photo.created_at).toLocaleDateString('es-ES')}
                  </p>
                  
                  {photo.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => moderatePhoto(photo.id, 'approved')}
                        className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
                      >
                        <Check className="h-4 w-4 mr-1" /> Aprobar
                      </button>
                      <button
                        onClick={() => moderatePhoto(photo.id, 'rejected')}
                        className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4 mr-1" /> Rechazar
                      </button>
                    </div>
                  )}
                  
                  {photo.status !== 'pending' && (
                    <div className={`px-3 py-1 rounded-full text-center text-sm ${
                      photo.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {photo.status === 'approved' ? 'Aprobada' : 'Rechazada'}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de vista previa */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              className="absolute -top-12 right-0 text-white text-3xl"
              onClick={() => setPreviewImage(null)}
            >
              <X className="h-8 w-8" />
            </button>
            <Image
              src={previewImage}
              alt="Vista previa"
              width={800}
              height={600}
              className="object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  )
}
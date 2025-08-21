'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Loader2, CheckCircle, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/supabase/supabase'

interface GalleryImage {
  id: string
  created_at: string
  guest_name: string
  image_url: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null)
  const [guestName, setGuestName] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [approvedPhotos, setApprovedPhotos] = useState<GalleryImage[]>([])
  const [loadingPhotos, setLoadingPhotos] = useState(true)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cargar fotos aprobadas
  useEffect(() => {
    const fetchApprovedPhotos = async () => {
      try {
        const { data, error } = await supabase
          .from('wedding_photos')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching photos:', error)
        } else {
          setApprovedPhotos(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoadingPhotos(false)
      }
    }

    fetchApprovedPhotos()
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    
    setUploadedFiles(Array.from(files))
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      setMessage({ text: 'Por favor selecciona al menos una foto', type: 'error' })
      return
    }

    if (!guestName.trim()) {
      setMessage({ text: 'Por favor ingresa tu nombre', type: 'error' })
      return
    }

    try {
      setMessage(null)
      setUploading(true)
      setProgress(0)

      let successfulUploads = 0

      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i]
        
        // Validaciones
        if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
          setMessage({ text: `El archivo ${file.name} no es JPG o PNG`, type: 'error' })
          continue
        }

        if (file.size > 5 * 1024 * 1024) {
          setMessage({ text: `El archivo ${file.name} excede 5MB`, type: 'error' })
          continue
        }

        // Subir archivo a Supabase Storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = fileName

        const { error: uploadError } = await supabase.storage
          .from('wedding-photos')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Error uploading file:', uploadError)
          setMessage({ text: `Error al subir ${file.name}: ${uploadError.message}`, type: 'error' })
          continue
        }

        // Obtener URL pública
        const { data: urlData } = supabase
          .storage
          .from('wedding-photos')
          .getPublicUrl(filePath)

        // Guardar en la base de datos
        const { error: dbError } = await supabase
          .from('wedding_photos')
          .insert({
            guest_name: guestName,
            image_url: urlData.publicUrl,
            status: 'pending'
          })

        if (dbError) {
          console.error('Error saving to database:', dbError)
          setMessage({ text: `Error al guardar ${file.name}`, type: 'error' })
        } else {
          successfulUploads++
          setProgress(((i + 1) / uploadedFiles.length) * 100)
        }
      }

      if (successfulUploads > 0) {
        setMessage({ 
          text: `¡${successfulUploads} foto(s) subidas correctamente! Serán revisadas antes de publicarse.`, 
          type: 'success' 
        })
        setUploadedFiles([])
        setGuestName('')
      }
      
    } catch (error) {
      console.error('Error:', error)
      setMessage({ text: 'Error inesperado al subir las fotos', type: 'error' })
    } finally {
      setUploading(false)
      setProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return
    
    if (direction === 'prev') {
      setSelectedImage(prev => 
        prev === 0 ? approvedPhotos.length - 1 : prev! - 1
      )
    } else {
      setSelectedImage(prev => 
        prev === approvedPhotos.length - 1 ? 0 : prev! + 1
      )
    }
  }

  return (
    <div className="min-h-screen bg-nature-cream py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Sección de subida */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">
            Comparte tus fotos de la boda
          </h1>
          <p className="text-lg text-nature-green max-w-2xl mx-auto">
            Sube las fotos que tomaste durante nuestra celebración. 
            Todas las fotos serán revisadas antes de publicarse.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Formulario de subida */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden border border-nature-sage p-6"
          >
            <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 -m-6 mb-6 text-white">
              <h2 className="text-xl font-bold">Sube tus fotos</h2>
            </div>

            <div className="mb-6">
              <label htmlFor="guest-name" className="block text-nature-green font-medium mb-2">
                Tu nombre *
              </label>
              <input
                type="text"
                id="guest-name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="¿Cómo te llamas?"
                className="w-full px-4 py-2 border border-nature-sage rounded-lg focus:ring-2 focus:ring-nature-green focus:border-transparent"
                disabled={uploading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-nature-green font-medium mb-2">
                Selecciona tus fotos *
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png"
                multiple
                disabled={uploading}
                className="hidden"
                id="photo-upload"
              />
              
              <label
                htmlFor="photo-upload"
                className={`flex flex-col items-center justify-center border-2 border-dashed border-nature-sage rounded-lg p-8 text-center cursor-pointer hover:border-nature-green transition-colors ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="h-12 w-12 text-nature-green mb-3" />
                <p className="text-nature-green font-medium">Haz clic o arrastra las fotos aquí</p>
                <p className="text-sm text-gray-500 mt-1">Formatos: JPG, PNG (Máx. 5MB por imagen)</p>
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-nature-green font-medium mb-3">Fotos seleccionadas:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="text-xs text-gray-500 truncate mt-1">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploading && (
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-nature-green h-2.5 rounded-full transition-all" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-center text-nature-green mt-2">Subiendo... {Math.round(progress)}%</p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading || uploadedFiles.length === 0 || !guestName.trim()}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
                uploading || uploadedFiles.length === 0 || !guestName.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-nature-green text-white hover:bg-opacity-90 transition-colors'
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Subir {uploadedFiles.length} foto(s)
                </>
              )}
            </button>

            {message && (
              <div className={`mt-4 p-3 rounded-lg text-center ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message.text}
              </div>
            )}
          </motion.div>

          {/* Instrucciones */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden border border-nature-sage p-6 h-fit"
          >
            <div className="bg-gradient-to-r from-nature-sage to-nature-green/80 p-4 -m-6 mb-6 text-white">
              <h2 className="text-xl font-bold">Instrucciones</h2>
            </div>
            
            <ul className="space-y-4 text-nature-green">
              <li className="flex items-start">
                <div className="bg-nature-sage/20 p-2 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-nature-sage flex-shrink-0" />
                </div>
                <span>Selecciona fotos en formato JPG o PNG</span>
              </li>
              <li className="flex items-start">
                <div className="bg-nature-sage/20 p-2 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-nature-sage flex-shrink-0" />
                </div>
                <span>Cada foto debe pesar menos de 5MB</span>
              </li>
              <li className="flex items-start">
                <div className="bg-nature-sage/20 p-2 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-nature-sage flex-shrink-0" />
                </div>
                <span>Puedes seleccionar múltiples fotos a la vez</span>
              </li>
              <li className="flex items-start">
                <div className="bg-nature-sage/20 p-2 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-nature-sage flex-shrink-0" />
                </div>
                <span>Todas las fotos serán revisadas antes de publicarse</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-nature-cream rounded-lg border border-nature-sage">
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-nature-green mr-2" />
                <p className="text-sm text-nature-green">
                  ¡Gracias por compartir tus recuerdos con nosotros!
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Galería de fotos aprobadas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden border border-nature-sage"
        >
          <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
            <h2 className="text-xl font-bold">Fotos de nuestros invitados</h2>
            <p className="text-sm opacity-90">
              {approvedPhotos.length > 0 
                ? `${approvedPhotos.length} foto(s) compartidas hasta ahora` 
                : 'Sé el primero en compartir tus fotos'
              }
            </p>
          </div>

          <div className="p-6">
            {loadingPhotos ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 text-nature-green animate-spin" />
              </div>
            ) : approvedPhotos.length === 0 ? (
              <div className="text-center py-10">
                <div className="bg-nature-cream rounded-full p-4 inline-flex mb-4">
                  <Upload className="h-10 w-10 text-nature-sage" />
                </div>
                <p className="text-nature-green">Aún no hay fotos aprobadas. ¡Sé el primero en compartir!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {approvedPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="aspect-square overflow-hidden rounded-lg cursor-pointer border border-nature-sage relative group"
                    onClick={() => openLightbox(index)}
                  >
                    <Image
                      src={photo.image_url}
                      alt={`Foto de ${photo.guest_name}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end">
                      <div className="p-2 text-white bg-gradient-to-t from-black/80 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-xs truncate">Por: {photo.guest_name || 'Anónimo'}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Lightbox para visualización de fotos */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation()
                closeLightbox()
              }}
              className="absolute top-6 right-6 text-white text-4xl z-50 hover:text-nature-sage transition-colors"
              aria-label="Cerrar visor"
            >
              &times;
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateImage('prev')
              }}
              className="absolute left-6 text-white text-4xl z-50 hover:text-nature-sage transition-colors p-2"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateImage('next')
              }}
              className="absolute right-6 text-white text-4xl z-50 hover:text-nature-sage transition-colors p-2"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            <div 
              className="relative w-full max-w-6xl h-[85vh] mx-16"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src={approvedPhotos[selectedImage].image_url}
                  alt={`Foto ampliada`}
                  fill
                  className="object-contain"
                  priority
                  quality={90}
                />
              </motion.div>
            </div>

            <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4">
              <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {approvedPhotos.length}
              </span>
              
              <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm max-w-md text-center">
                Por: {approvedPhotos[selectedImage].guest_name || 'Anónimo'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
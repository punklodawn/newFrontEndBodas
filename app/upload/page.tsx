'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '@/supabase/supabase'

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null)
  const [guestName, setGuestName] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        const filePath = fileName // Sin la carpeta guest-uploads por ahora

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
          // Intentar eliminar el archivo subido si falla la base de datos
          await supabase.storage
            .from('wedding-photos')
            .remove([filePath])
          
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

  return (
    <div className="min-h-screen bg-nature-cream py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">
            Comparte tus fotos de la boda
          </h1>
          <p className="text-lg text-nature-green max-w-2xl mx-auto">
            Sube las fotos que tomaste durante nuestra celebración. 
            Todas las fotos serán revisadas antes de publicarse.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden border border-nature-sage p-6 mb-8"
        >
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden border border-nature-sage p-6"
        >
          <h2 className="text-xl font-bold text-nature-green mb-4">Instrucciones para subir fotos</h2>
          <ul className="space-y-2 text-nature-green">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-nature-sage mr-2 mt-0.5 flex-shrink-0" />
              <span>Selecciona fotos en formato JPG o PNG</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-nature-sage mr-2 mt-0.5 flex-shrink-0" />
              <span>Cada foto debe pesar menos de 5MB</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-nature-sage mr-2 mt-0.5 flex-shrink-0" />
              <span>Puedes seleccionar múltiples fotos a la vez</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-nature-sage mr-2 mt-0.5 flex-shrink-0" />
              <span>Todas las fotos serán revisadas antes de publicarse</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
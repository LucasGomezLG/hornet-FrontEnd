import { useRef, useState } from 'react'
import axios from 'axios'

export default function ImageUploader({ getFirma, onUploaded, currentUrl }) {
  const inputRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(currentUrl || null)

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const { data: firma } = await getFirma()
      const form = new FormData()
      form.append('file', file)
      form.append('api_key', firma.apiKey)
      form.append('timestamp', firma.timestamp)
      form.append('signature', firma.signature)
      form.append('folder', firma.folder)

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${firma.cloudName}/image/upload`,
        form
      )
      const url = res.data.secure_url
      setPreview(url)
      onUploaded(url)
    } catch {
      setError('Error al subir la imagen. Intentá de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current.click()}
        className="border-2 border-dashed border-neutral-300 hover:border-hornet-gold transition-colors cursor-pointer aspect-square flex flex-col items-center justify-center bg-hornet-surface overflow-hidden relative">
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-4">
            <p className="text-2xl mb-2">{uploading ? '⏳' : '📷'}</p>
            <p className="text-xs text-hornet-muted">{uploading ? 'Subiendo...' : 'Click para subir imagen'}</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <p className="text-sm font-medium text-hornet-muted">Subiendo...</p>
          </div>
        )}
      </div>
      {preview && (
        <button
          type="button"
          onClick={() => !uploading && inputRef.current.click()}
          className="mt-1 text-xs text-hornet-muted underline">
          Cambiar imagen
        </button>
      )}
      {error && <p className="text-xs text-hornet-error mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  )
}

import { useState } from 'react'
import CotizadorForm from '../../components/cotizador/CotizadorForm'
import ResultadoCotizacion from '../../components/cotizador/ResultadoCotizacion'
import { cotizar } from '../../api/cotizador'

export default function CotizarPage() {
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)

  const handleCotizar = async (data) => {
    setLoading(true)
    setError(null)
    setResultado(null)
    try {
      const res = await cotizar(data)
      setResultado(res.data)
    } catch (e) {
      setError('Hubo un error al calcular el precio. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-hornet-dark">Cotizador de importación</h1>
          <p className="text-hornet-muted mt-2">
            Calculá cuánto cuesta importar tu producto, con todos los impuestos incluidos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <CotizadorForm onSubmit={handleCotizar} loading={loading} />
          </div>

          <div className="lg:sticky lg:top-8">
            {error && (
              <div className="border border-hornet-error bg-hornet-error-bg p-4 text-sm text-hornet-error">
                {error}
              </div>
            )}
            {!resultado && !error && (
              <div className="border border-dashed border-neutral-300 p-8 text-center text-hornet-muted">
                <p className="text-4xl mb-3">📦</p>
                <p className="font-medium">El desglose aparece acá</p>
                <p className="text-sm mt-1">Completá el formulario y calculá.</p>
              </div>
            )}
            {resultado && <ResultadoCotizacion resultado={resultado} />}
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-200 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: '🔢', title: 'Precio exacto', desc: 'Arancel + IVA + flete + fee, todo calculado.' },
            { icon: '⚡', title: 'Resultado al instante', desc: 'Sin esperar emails ni formularios.' },
            { icon: '📋', title: 'Quedá registrado', desc: 'Iniciá sesión para guardar la cotización.' },
          ].map(item => (
            <div key={item.title}>
              <p className="text-2xl mb-2">{item.icon}</p>
              <p className="font-black text-hornet-dark text-sm">{item.title}</p>
              <p className="text-xs text-hornet-muted mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

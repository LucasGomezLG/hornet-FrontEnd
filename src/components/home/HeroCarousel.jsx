import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router'

const SLIDES = [
  {
    id: 1,
    image: '/Imagen1.jpg',
    gradient: 'linear-gradient(135deg, #111111 0%, #1a1a1a 50%, #0d0d0d 100%)',
    eyebrow: 'Importación a pedido',
    title: 'Sabé exactamente cuánto\ncuesta importar',
    subtitle: 'Cotizador instantáneo con aranceles, IVA y flete incluidos. Sin sorpresas, sin letra chica.',
    cta: { label: 'Cotizar gratis →', to: '/cotizar' },
    ctaSecondary: { label: '¿Cómo funciona?', to: '/como-funciona' },
    accent: '#F5B800',
  },
  {
    id: 2,
    image: '/Imagen2.jpg',
    gradient: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%)',
    eyebrow: 'Tienda con stock',
    title: 'Productos importados\nlistos para entrega inmediata',
    subtitle: 'Stock disponible en Argentina. Comprá hoy y recibí en tu puerta sin esperas.',
    cta: { label: 'Ver tienda →', to: '/tienda' },
    ctaSecondary: null,
    accent: '#60a5fa',
  },
  {
    id: 3,
    image: '/Imagen3.jpg',
    gradient: 'linear-gradient(135deg, #0d0d0d 0%, #1c1917 50%, #111111 100%)',
    eyebrow: 'Marketplace',
    title: 'Vendedores verificados,\nprecios sin intermediarios',
    subtitle: 'Comprá directo a vendedores independientes con el respaldo de Hornet Imports.',
    cta: { label: 'Ver marketplace →', to: '/marketplace' },
    ctaSecondary: null,
    accent: '#34d399',
  },
]

const INTERVAL = 5000

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(null)

  const goTo = useCallback((index) => {
    setCurrent(((index % SLIDES.length) + SLIDES.length) % SLIDES.length)
  }, [])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, INTERVAL)
    return () => clearInterval(id)
  }, [paused, next])

  // Touch / drag swipe
  const handlePointerDown = (e) => {
    dragStart.current = e.clientX
    setDragging(false)
  }
  const handlePointerUp = (e) => {
    if (dragStart.current === null) return
    const delta = e.clientX - dragStart.current
    if (Math.abs(delta) > 50) {
      delta < 0 ? next() : prev()
      setDragging(true)
    }
    dragStart.current = null
  }

  const slide = SLIDES[current]

  return (
    <section
      className="relative w-full overflow-hidden select-none"
      style={{ height: 'clamp(440px, 62vh, 660px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Slides track */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)`, willChange: 'transform' }}
      >
        {SLIDES.map((s) => (
          <div
            key={s.id}
            className="relative w-full flex-shrink-0 h-full"
            style={{
              background: s.image
                ? `linear-gradient(to bottom, rgba(0,0,0,.45) 0%, rgba(0,0,0,.55) 100%), url(${s.image}) center/cover no-repeat`
                : s.gradient,
            }}
          >
            {/* Grid pattern overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />
            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.4) 100%)' }}
            />
          </div>
        ))}
      </div>

      {/* Text content — fixed on top, transitions with opacity */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 flex items-center justify-center px-6 text-center transition-opacity duration-500"
          style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}
        >
          <div className="max-w-3xl">
            <p
              className="text-xs font-black uppercase tracking-widest mb-4"
              style={{ color: s.accent }}
            >
              {s.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5 whitespace-pre-line">
              {s.title}
            </h1>
            <p className="text-white/65 text-base sm:text-lg max-w-xl mx-auto mb-8">
              {s.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={s.cta.to}
                className="inline-block bg-hornet-gold text-hornet-dark text-sm font-black px-8 py-3.5 hover:brightness-95 transition-all"
                onClick={(e) => dragging && e.preventDefault()}
              >
                {s.cta.label}
              </Link>
              {s.ctaSecondary && (
                <Link
                  to={s.ctaSecondary.to}
                  className="inline-block border border-white/25 text-white text-sm font-medium px-8 py-3.5 hover:bg-white/10 transition-all"
                  onClick={(e) => dragging && e.preventDefault()}
                >
                  {s.ctaSecondary.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Arrow prev */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors rounded-full backdrop-blur-sm"
        aria-label="Anterior"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Arrow next */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors rounded-full backdrop-blur-sm"
        aria-label="Siguiente"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Ir a slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === current ? 28 : 6,
              backgroundColor: i === current ? slide.accent : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        {!paused && (
          <div
            key={`${current}-progress`}
            className="h-full origin-left"
            style={{
              backgroundColor: slide.accent,
              animation: `carousel-progress ${INTERVAL}ms linear forwards`,
            }}
          />
        )}
      </div>
    </section>
  )
}

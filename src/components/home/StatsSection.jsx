import { useRef, useState, useEffect } from 'react'
import FadeIn from '../ui/FadeIn'

const STATS = [
  { value: 200, suffix: '+', label: 'Importaciones realizadas' },
  { value: 12,  suffix: '+', label: 'Países de origen' },
  { value: 24,  suffix: 'hs', label: 'Respuesta promedio' },
  { value: 4.9, suffix: '★', label: 'Satisfacción del cliente', decimals: 1 },
]

function useCounter(target, duration, started, decimals = 0) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    const startTime = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(parseFloat((eased * target).toFixed(decimals)))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started, target, duration, decimals])
  return count
}

function StatItem({ value, suffix, label, decimals = 0, started, delay }) {
  const count = useCounter(value, 1600, started, decimals)
  return (
    <FadeIn delay={delay} className="text-center px-6">
      <p className="text-4xl sm:text-5xl font-black text-hornet-gold tabular-nums">
        {decimals ? count.toFixed(decimals) : count}{suffix}
      </p>
      <p className="text-sm text-white/60 mt-2 font-medium">{label}</p>
    </FadeIn>
  )
}

export default function StatsSection() {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="bg-hornet-dark border-y border-neutral-800 py-14 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <StatItem key={s.label} {...s} started={started} delay={i * 80} />
        ))}
      </div>
    </section>
  )
}

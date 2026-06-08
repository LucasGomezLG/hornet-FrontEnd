import { useRef, useState, useEffect } from 'react'

export default function FadeIn({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(22px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}

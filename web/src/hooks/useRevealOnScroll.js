import { useEffect, useRef } from 'react'

export function useRevealOnScroll(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.classList.add('reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('isRevealed')
          observer.unobserve(entry.target)
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.18,
        ...options,
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options])

  return ref
}


import { useRevealOnScroll } from '../hooks/useRevealOnScroll'

export function CategorySection({ id, title, description }) {
  const revealRef = useRevealOnScroll()

  return (
    <section ref={revealRef} id={id} className="panel category">
      <div className="categoryHeader">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="thumbGrid" aria-label={`${title} Projekte`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <article key={i} className="thumbCard">
            <div className="thumbMedia" />
            <div className="thumbMeta">
              <div className="thumbTitle">{`Projekt ${String(i + 1).padStart(2, '0')}`}</div>
              <div className="thumbSub">Platzhalter</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}


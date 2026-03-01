import './App.css'
import LandscapeBackground from './components/LandscapeBackground'
import { useScrollProgress } from './hooks/useScrollProgress'
import { CategorySection } from './components/CategorySection'
import gekoLogoWhite from './assets/geko-logo-white.png'
import gekoProfile from './assets/geko-profile.png'
import { useEffect, useMemo, useState } from 'react'

function App() {
  const scrollProgress = useScrollProgress()
  const [activeSectionId, setActiveSectionId] = useState('animierte-plakat')

  const categories = useMemo(
    () => [
      {
        id: 'animierte-plakat',
        title: 'Animierte Plakat',
        nav: 'Plakat',
        description: 'Motion-Poster, Loop-Animationen und typografische Studien.',
      },
      {
        id: 'corporate-design',
        title: 'Corporate Designs (CD)',
        nav: 'CD',
        description: 'Branding, Logomarken, Systeme und Anwendungen.',
      },
      {
        id: 'animationen',
        title: 'Animationen',
        nav: 'Animation',
        description: '2D/3D Motion, kurze Clips, Sequenzen und Tests.',
      },
      {
        id: '3d-modelle',
        title: '3D Modelle',
        nav: '3D',
        description: 'Modeling, Shading und Render-Studies.',
      },
      {
        id: 'charakterdesign',
        title: 'Charakterdesign',
        nav: 'Charakter',
        description: 'Figuren, Silhouetten, Turnarounds und Expressions.',
      },
      {
        id: 'artworks',
        title: 'Artworks',
        nav: 'Artworks',
        description: 'Illustrationen, Concepts und visuelle Experimente.',
      },
      {
        id: 'posters',
        title: 'Posters',
        nav: 'Posters',
        description: 'Plakatserien, Layouts und Druck-Varianten.',
      },
      {
        id: 'photos',
        title: 'Photos',
        nav: 'Photos',
        description: 'Fotografie, Bearbeitung und Serien.',
      },
    ],
    [],
  )

  useEffect(() => {
    const sectionEls = categories
      .map((c) => document.getElementById(c.id))
      .filter(Boolean)

    if (!sectionEls.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0]

        if (visible?.target?.id) setActiveSectionId(visible.target.id)
      },
      { threshold: [0.2, 0.35, 0.5, 0.65] },
    )

    sectionEls.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [categories])

  return (
    <div className="appRoot">
      <LandscapeBackground scrollProgress={scrollProgress} />

      <header className="topBar">
        <div className="brand">
          <img className="brandLogo" src={gekoLogoWhite} alt="GEKO Logo" />
          <div className="brandText">GEKO</div>
        </div>
        <nav className="topNav" aria-label="Portfolio">
          {categories.map((c) => (
            <a
              key={c.id}
              className={activeSectionId === c.id ? 'isActive' : undefined}
              href={`#${c.id}`}
              aria-current={activeSectionId === c.id ? 'page' : undefined}
            >
              {c.nav}
            </a>
          ))}
        </nav>
      </header>

      <main className="content">
        <section className="hero">
          <div className="heroLayout">
            <div className="heroBlock heroBlockTop">
              <div className="heroKicker">Kommunikationsdesign Portfolio</div>
              <h1 className="heroTitle">Live-Landschaft als Scroll-Wallpaper.</h1>
              <p className="heroSub">
                Kategorien liegen als schwarze Flächen über der Szene. Beim Scrollen
                bewegt sich der Hintergrund weich mit.
              </p>
            </div>

            <div className="heroBlock heroBlockBottom" aria-label="Profil">
              <div className="profileRow">
                <img className="profileImg" src={gekoProfile} alt="Profilbild" />
                <div className="profileText">
                  <div className="profileName">junes</div>
                  <div className="profileRole">Kommunikationsdesigner · Motion · 3D</div>
                </div>
              </div>
              <div className="heroHint">
                Scroll, um die Kategorien in den schwarzen Flächen zu entdecken.
              </div>
            </div>
          </div>
        </section>

        {categories.map((c) => (
          <CategorySection
            key={c.id}
            id={c.id}
            title={c.title}
            description={c.description}
          />
        ))}
      </main>
    </div>
  )
}

export default App

import './App.css'
import LandscapeBackground from './components/LandscapeBackground'
import { useScrollProgress } from './hooks/useScrollProgress'
import gekoLogoWhite from './assets/geko-logo-white.png'
import gekoProfile from './assets/geko-profile.png'
import { useMemo } from 'react'
import { useRevealOnScroll } from './hooks/useRevealOnScroll'

function App() {
  const scrollProgress = useScrollProgress()
  const aboutRef = useRevealOnScroll()
  const categoriesRef = useRevealOnScroll()
  const footerRef = useRevealOnScroll()

  const categories = useMemo(
    () => [
      {
        id: 'animierte-plakat',
        title: 'Animierte Plakat',
        description: 'Motion-Poster, Loop-Animationen und typografische Studien.',
      },
      {
        id: 'corporate-design',
        title: 'Corporate Designs (CD)',
        description: 'Branding, Logomarken, Systeme und Anwendungen.',
      },
      {
        id: 'animationen',
        title: 'Animationen',
        description: '2D/3D Motion, kurze Clips, Sequenzen und Tests.',
      },
      {
        id: '3d-modelle',
        title: '3D Modelle',
        description: 'Modeling, Shading und Render-Studies.',
      },
      {
        id: 'charakterdesign',
        title: 'Charakterdesign',
        description: 'Figuren, Silhouetten, Turnarounds und Expressions.',
      },
      {
        id: 'artworks',
        title: 'Artworks',
        description: 'Illustrationen, Concepts und visuelle Experimente.',
      },
      {
        id: 'posters',
        title: 'Posters',
        description: 'Plakatserien, Layouts und Druck-Varianten.',
      },
      {
        id: 'photos',
        title: 'Photos',
        description: 'Fotografie, Bearbeitung und Serien.',
      },
    ],
    [],
  )

  return (
    <div className="appRoot">
      <LandscapeBackground scrollProgress={scrollProgress} />

      <header className="topBar">
        <div className="brand">
          <img className="brandLogo" src={gekoLogoWhite} alt="GEKO Logo" />
          <div className="brandText">GEKO</div>
        </div>
        <nav className="topNav" aria-label="Sektionen">
          <a href="#about">Über mich</a>
          <a href="#kategorien">Kategorien</a>
          <a href="#footer">Footer</a>
        </nav>
      </header>

      <main className="content">
        <section className="hero">
          <div className="heroTitleBlock">
            <div className="heroGradientBar" aria-hidden="true" />
            <h1 className="pageTitle">GEKO</h1>
            <p className="pageSubtitle">
              Portfolio · Kommunikationsdesign · Motion · 3D
            </p>
          </div>
        </section>

        <section ref={aboutRef} id="about" className="panel bigPanel">
          <div className="panelHead">
            <h2>Über mich</h2>
            <p>Kurzer Text über dich + Skills + Fokus. (Platzhalter)</p>
          </div>

          <div className="aboutGrid">
            <div className="aboutCard">
              <div className="profileRow">
                <img className="profileImgLg" src={gekoProfile} alt="Profilbild" />
                <div className="profileText">
                  <div className="profileName">Dein Name</div>
                  <div className="profileRole">Kommunikationsdesigner · Motion · 3D</div>
                </div>
              </div>

              <div className="aboutText">
                <p>
                  Ich gestalte visuelle Systeme, Animationen und 3D‑Welten.
                  Meine Arbeiten verbinden Grafik, Bewegung und Atmosphäre.
                </p>
                <p className="muted">
                  Standort · Kontakt · Verfügbarkeit (Platzhalter)
                </p>
              </div>
            </div>

            <div className="aboutCard">
              <div className="miniTitle">Skills</div>
              <ul className="tagList" aria-label="Skills">
                <li>Brand Design</li>
                <li>Motion Design</li>
                <li>3D</li>
                <li>Illustration</li>
                <li>Typography</li>
                <li>UI/Visual</li>
              </ul>

              <div className="miniTitle">Tools</div>
              <ul className="tagList" aria-label="Tools">
                <li>After Effects</li>
                <li>Blender</li>
                <li>Cinema 4D</li>
                <li>Photoshop</li>
                <li>Illustrator</li>
                <li>Figma</li>
              </ul>
            </div>
          </div>
        </section>

        <section ref={categoriesRef} id="kategorien" className="panel bigPanel">
          <div className="panelHead">
            <h2>Kategorien</h2>
            <p>Platzhalter-Kacheln – hier kommen später deine Projekte rein.</p>
          </div>

          <div className="categoryGrid">
            {categories.map((c) => (
              <article key={c.id} className="catCard">
                <div className="catTitleRow">
                  <div className="catDot" aria-hidden="true" />
                  <div className="catTitle">{c.title}</div>
                </div>
                <div className="catDesc">{c.description}</div>

                <div className="thumbGrid" aria-label={`${c.title} Platzhalter`}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="thumbCard">
                      <div className="thumbMedia" />
                      <div className="thumbMeta">
                        <div className="thumbTitle">{`Projekt ${String(i + 1).padStart(2, '0')}`}</div>
                        <div className="thumbSub">Platzhalter</div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section ref={footerRef} id="footer" className="panel footerPanel">
          <div className="footerGrid">
            <div>
              <div className="miniTitle">Kontakt</div>
              <div className="muted">E‑Mail: name@mail.com (Platzhalter)</div>
              <div className="muted">Instagram / Behance / Vimeo (Platzhalter)</div>
            </div>
            <div>
              <div className="miniTitle">Impressum</div>
              <div className="muted">Text/Links (Platzhalter)</div>
            </div>
            <div>
              <div className="miniTitle">Copyright</div>
              <div className="muted">© {new Date().getFullYear()} GEKO</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App

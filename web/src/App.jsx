import './App.css'
import LandscapeBackground from './components/LandscapeBackground'
import { useScrollProgress } from './hooks/useScrollProgress'
import { CategorySection } from './components/CategorySection'
import gekoLogoWhite from './assets/geko-logo-white.png'
import gekoProfile from './assets/geko-profile.png'

function App() {
  const scrollProgress = useScrollProgress()

  const categories = [
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
  ]

  return (
    <div className="appRoot">
      <LandscapeBackground scrollProgress={scrollProgress} />

      <header className="topBar">
        <div className="brand">
          <img className="brandLogo" src={gekoLogoWhite} alt="GEKO Logo" />
          <div className="brandText">GEKO</div>
        </div>
        <nav className="topNav" aria-label="Portfolio">
          <a href="#animierte-plakat">Plakat</a>
          <a href="#corporate-design">CD</a>
          <a href="#animationen">Animation</a>
          <a href="#3d-modelle">3D</a>
          <a href="#charakterdesign">Charakter</a>
          <a href="#artworks">Artworks</a>
          <a href="#posters">Posters</a>
          <a href="#photos">Photos</a>
        </nav>
      </header>

      <main className="content">
        <section className="hero">
          <div className="heroCard">
            <div className="heroKicker">Kommunikationsdesign Portfolio</div>
            <h1 className="heroTitle">Live-Landschaft als Scroll-Wallpaper.</h1>
            <p className="heroSub">
              Kategorien sind als schwarze Flächen über der Szene angeordnet.
              Beim Scrollen bewegt sich der Hintergrund weich mit.
            </p>

            <div className="profileRow" aria-label="Profil">
              <img className="profileImg" src={gekoProfile} alt="Profilbild" />
              <div className="profileText">
                <div className="profileName">junes</div>
                <div className="profileRole">Kommunikationsdesigner · Motion · 3D</div>
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

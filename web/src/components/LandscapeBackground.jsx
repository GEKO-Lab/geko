import Lottie from 'lottie-react'
import waveAnimation from '../assets/wave-background.json'

export default function LandscapeBackground({ scrollProgress: _scrollProgress = 0 }) {
  return (
    <div className="bgCanvas" aria-hidden="true">
      <div className="waveBackground">
        <Lottie
          animationData={waveAnimation}
          loop
          autoplay
          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
        />
      </div>
    </div>
  )
}

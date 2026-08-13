import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Metrics } from './components/Metrics'
import { Work } from './components/Work'
import { Cloud } from './components/Cloud'
import { Process } from './components/Process'
import { Toolbelt } from './components/Toolbelt'
import { Experience } from './components/Experience'
import { Contact, Footer } from './components/Contact'
import { useParallax, useSpotlight } from './hooks'

export default function App() {
  useSpotlight()
  useParallax()

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-raised focus:px-4 focus:py-2 focus:text-sm focus:border focus:border-strong"
      >
        Skip to content
      </a>

      <Nav />

      <main>
        <Hero />
        <Metrics />
        <Work />
        <Cloud />
        <Process />
        <Toolbelt />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

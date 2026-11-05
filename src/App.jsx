import { TopBar } from './components/TopBar'
import { Hero } from './sections/Hero'
import { Overview } from './sections/Overview'
import { Parts } from './sections/Parts'
import { Theory } from './sections/Theory'
import { Predictions } from './sections/Predictions'
import { Build } from './sections/Build'
import { Measure } from './sections/Measure'
import { Analysis } from './sections/Analysis'
import { Challenges } from './sections/Challenges'
import { Conclusion } from './sections/Conclusion'
import { Footer } from './sections/Footer'

export default function App() {
  return (
    <>
      <a className="skip" href="#overview">
        Skip to the guide
      </a>
      <TopBar />
      <main>
        <Hero />
        <Overview />
        <Parts />
        <Theory />
        <Predictions />
        <Build />
        <Measure />
        <Analysis />
        <Challenges />
        <Conclusion />
      </main>
      <Footer />
    </>
  )
}

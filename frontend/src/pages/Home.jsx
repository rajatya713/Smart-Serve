
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Rulebook from '../components/Rulebook'
import Services from '../components/Services'

const Home = () => {
  return (
    <>
      <section id='hero'>
        <Hero />
      </section>
      <section id='about'>
        <About />
      </section>
      <section id='services'>
        <Services />
      </section>
      <section id='contact'>
        <Contact />
      </section>
      <section id='footer'>
        <Footer />
      </section>
      
    </>
  )
}

export default Home
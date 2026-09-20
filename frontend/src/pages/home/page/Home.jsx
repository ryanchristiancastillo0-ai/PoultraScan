import {PageStyles} from '../css/PageStyles.jsx'
import {NavBar,Hero,StatsStrip,HowItWorks,FeatureGrid,Testimonial,CtaBanner,Footer} from '../components/index'

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#F7FAF8]">
      <PageStyles />
      <NavBar />
      <Hero />
      <StatsStrip />
      <HowItWorks />
      <FeatureGrid />
      <Testimonial />
      <CtaBanner />
      <Footer />
    </div>
  );
}
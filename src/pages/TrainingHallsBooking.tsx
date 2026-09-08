import Footer from '../components/Footer';
import Header from '../components/Header';
import TrainingSlider from '../components/TrainingSlider';
import TrainingHallsSection, { TrainingHallsIntro } from '../components/TrainingHallsSection';
import { useSiteLanguage } from '../context/SiteLanguageContext';

function TrainingHallsBookingPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]" dir={isEnglish ? 'ltr' : 'rtl'}>
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <div className="space-y-6">
            <TrainingHallsIntro />
            <TrainingSlider />
            <TrainingHallsSection showIntro={false} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default TrainingHallsBookingPage;
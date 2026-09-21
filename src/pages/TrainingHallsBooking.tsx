import { useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import TrainingSlider from '../components/TrainingSlider';
import TrainingHallsSection, { TrainingHallsIntro } from '../components/TrainingHallsSection';
import { useSiteLanguage } from '../context/SiteLanguageContext';

function TrainingHallsBookingPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';

  useEffect(() => {
    if (window.location.hash !== '#booking-form') return undefined;

    const scrollToBookingForm = window.setTimeout(() => {
      const formElement = document.getElementById('booking-form');
      if (!formElement) return;

      const topOffset = formElement.getBoundingClientRect().top + window.scrollY - 96 - 40;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }, 0);

    return () => window.clearTimeout(scrollToBookingForm);
  }, []);

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
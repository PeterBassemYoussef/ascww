import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const targetId = decodeURIComponent(hash.slice(1));
      const scrollToTarget = () => {
        const target = document.getElementById(targetId);
        if (!target) return false;
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
        return true;
      };

      if (scrollToTarget()) return;

      const observer = new MutationObserver(() => {
        if (scrollToTarget()) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });

      const timeoutId = window.setTimeout(() => observer.disconnect(), 5000);
      return () => {
        observer.disconnect();
        window.clearTimeout(timeoutId);
      };
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;

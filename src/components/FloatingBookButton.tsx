import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'lucide-react';

const FloatingBookButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    toggleVisibility(); // set initial state on mount
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility as any);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    // If we're already on /services and the target exists, smooth scroll.
    const onServicesPage =
      typeof window !== 'undefined' &&
      window.location.pathname.replace(/\/+$/, '') === '/services';

    const targetId = 'book';
    const el = document.getElementById(targetId);

    if (onServicesPage && el) {
      // Smooth scroll to the booking section and update hash (no extra navigation)
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update the URL hash without reloading or adding history entries
      if (history.replaceState) {
        history.replaceState(null, '', `#${targetId}`);
      } else {
        window.location.hash = `#${targetId}`;
      }
      return;
    }

    // Otherwise do a full navigation so the browser handles the #hash reliably.
    // This avoids the "tap twice" behavior some mobile browsers have with SPA routing.
    window.location.assign('/services#book');
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 md:hidden transition-transform ${
        isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isVisible}
    >
      <button
        onClick={handleClick}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center space-x-2 font-medium transition-colors duration-200 active:scale-95"
        aria-label="Book an appointment"
      >
        <Calendar className="h-5 w-5" />
        <span>Book</span>
      </button>
    </div>
  );
};

export default FloatingBookButton;

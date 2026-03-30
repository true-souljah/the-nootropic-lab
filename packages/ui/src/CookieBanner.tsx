'use client';
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  }

  function decline() {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm flex-1">
          We use analytics cookies to improve your experience. We do not use advertising cookies.
          See our{' '}
          <a href="/privacy-policy" className="underline text-green-400">
            privacy policy
          </a>
          .
          <span className="block text-xs text-gray-400 mt-1">
            GDPR: Analytics fires only after you accept. Necessary cookies are always active.
          </span>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={accept}
            className="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded"
          >
            Accept Analytics
          </button>
          <button
            onClick={decline}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

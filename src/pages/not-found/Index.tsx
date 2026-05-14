import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 - Page Not Found | SEeds';
  }, []);

  return (
    <div className="min-h-dvh bg-[#ECEFFF] font-inter flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="text-9xl font-bold bg-gradient-to-r from-[#4D55CC] to-[#8B4CFF] bg-clip-text text-transparent">
            404
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-800 mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4D55CC] to-[#8B4CFF] text-white font-medium rounded-full hover:opacity-90 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
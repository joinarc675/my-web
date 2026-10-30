import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    document.title = 'Abdul Rehman Cheema (ARC) | Counselling & Career Mentorship';
  }, []);

  return (
    <main className="fixed inset-0 z-0 bg-black">
      <iframe
        title="Abdul Rehman Cheema counselling and career mentorship home page"
        src={`/main02.html${location.hash}`}
        className="block h-full w-full border-0"
        allow="clipboard-write"
      />
    </main>
  );
}

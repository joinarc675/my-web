import { useEffect } from 'react';

export default function CareerMentorshipPage() {
  useEffect(() => {
    const destination = new URL('/career-mentorship.html', window.location.origin);
    destination.search = window.location.search;
    destination.hash = window.location.hash;
    window.location.replace(destination.href);
  }, []);

  return (
    <main className="min-h-screen bg-black p-8 text-center text-white">
      <p>
        Opening the Career Mentorship page…{' '}
        <a className="underline" href="/career-mentorship.html">
          Continue
        </a>
      </p>
    </main>
  );
}
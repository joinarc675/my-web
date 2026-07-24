import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// NOTE: This placeholder male model photo should be swapped for Abdul Rehman Cheema's actual photo once received from the client.
import therapistImg from '../assets/hero-section.webp';

export default function Hero() {
  const navigate = useNavigate();
  const tags = [
    'Career Decisions',
    'Self-Development',
    'Work-Life Balance',
    'Relationships Issues',
    'Marital Challenges',
    'Purposeful Parenting',
    'Spiritual Well-Being',
    'Spiritual Hollowness'
  ];

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center pt-4 pb-12 md:pt-4 md:pb-16 overflow-hidden bg-[var(--neu-base)] transition-colors duration-300">
      {/* Warm Gold/Amber Glow Blobs using Theme Colors */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[var(--neu-accent)]/10 blur-[130px] rounded-full pointer-events-none transition-colors duration-300" />
      <div className="absolute bottom-[10%] left-[5%] w-80 h-80 bg-[var(--neu-accent)]/5 blur-[100px] rounded-full pointer-events-none transition-colors duration-300" />

      <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center text-center max-w-4xl space-y-6">

        {/* On top: "Confusion to Clarity" heading */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--neu-accent)] bg-[var(--neu-accent)]/10 rounded-full border border-[var(--neu-border)] transition-colors duration-300">
            Welcome Here!
          </div>

          <h1 className="text-left leading-tight text-[var(--neu-text)] transition-colors duration-300">
            {/* "from" with gold highlight box */}
            <span className="block mb-1">
              <span className="inline-block italic font-bold text-xl md:text-2xl text-[var(--neu-base)] bg-[var(--neu-accent)] px-2 py-0.5 rounded-sm">
                from
              </span>
            </span>
            {/* "Confusion [to] Clarity" */}
            <span className="flex items-center gap-3 flex-wrap">
              <span className="text-4xl md:text-6xl font-extrabold text-[var(--neu-accent)]">Confusion</span>
              <span className="inline-flex items-center italic justify-center text-sm md:text-base font-bold text-[var(--neu-accent)] border-2 border-[var(--neu-accent)] px-2 py-0.5 rounded-sm">
                to
              </span>
              <span className="text-4xl md:text-6xl font-extrabold text-[var(--neu-accent)]">Clarity</span>
            </span>
          </h1>
        </motion.div>

        {/* Then: Image */}
        <motion.div
          className="w-full max-w-[320px] md:max-w-[360px] mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[var(--neu-card-bg)] border border-[var(--neu-border)] shadow-2xl transition-all duration-300">
            <img
              src={therapistImg}
              alt="Abdul Rehman Cheema — Islamic Counsellor"
              className="object-cover w-full h-full grayscale-[10%] contrast-[1.05]"
              fetchpriority="high"
              decoding="async"
              width="360"
              height="450"
            />
            {/* Dark gradient overlay that adjusts to the base theme background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--neu-base)] via-transparent to-transparent opacity-40 transition-all duration-300"></div>
          </div>
        </motion.div>

        {/* Then: Name & Bio & Tags inside a beautifully centered content panel */}
        <motion.div
          className="w-full max-w-3xl flex flex-col items-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--neu-text)] tracking-wide transition-colors duration-300">
              Abdul Rehman Cheema
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-[var(--neu-text-muted)] transition-colors duration-300">
              Islamic counselor blending Psychology, Neuroscience, and Shariah to provide practical guidance.
            </p>

            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-[var(--neu-text-muted)] transition-colors duration-300" style={{ textDecoration: 'line-through' }}>
              Medical or Clinical Treatment
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 max-w-xl mx-auto">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3.5 py-1.5 bg-[var(--neu-card-bg)] border border-[var(--neu-border)] text-[var(--neu-text-muted)] text-xs font-bold rounded-lg hover:border-[var(--neu-accent)] hover:text-[var(--neu-text)] transition-colors duration-300 cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="pt-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/booking')}
              className="glass-btn-primary px-8 py-4 text-base cursor-pointer font-bold transition-all duration-300 border-none"
            >
              Book a Session
            </motion.button>
          </div>
        </motion.div>

        {/* Trust Stats Bar */}
        <motion.div
          className="grid grid-cols-2 gap-8 md:gap-16 pt-8 border-t border-[var(--neu-border)] w-full max-w-2xl mx-auto transition-colors duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div>
            <div className="text-3xl font-extrabold text-[var(--neu-accent)] transition-colors duration-300">250+</div>
            <div className="text-xs uppercase tracking-wider text-[var(--neu-text-muted)] font-medium mt-1 leading-snug transition-colors duration-300">
              Clients across 10+ countries
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[var(--neu-accent)] transition-colors duration-300">1M+</div>
            <div className="text-xs uppercase tracking-wider text-[var(--neu-text-muted)] font-medium mt-1 leading-snug transition-colors duration-300">
              Reached through educational content
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

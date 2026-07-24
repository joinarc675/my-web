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
      <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center text-center max-w-4xl space-y-6">
        <motion.div
          className="space-y-3 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-center leading-tight transition-colors duration-300">
            {/* "FROM CONFUSION" — Poppins Light with wide tracking */}
            <span className="block font-poppins font-light text-sm md:text-lg lg:text-xl tracking-[0.35em] md:tracking-[0.45em] uppercase text-[var(--neu-text)] opacity-90 transition-colors duration-300 pl-[0.35em] md:pl-[0.45em]">
              FROM CONFUSION
            </span>

            {/* Ornamental Thin Divider with Center Diamond */}
            <div className="flex items-center justify-center max-w-xs md:max-w-md mx-auto opacity-70">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[var(--neu-accent)] to-transparent" />
              <span className="text-[var(--neu-accent)] text-xs md:text-sm">✦</span>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[var(--neu-accent)] to-transparent" />
            </div>

            {/* "TO CLARITY" — Playfair Display Bold Serif */}
            <span className="block font-playfair font-bold md:font-extrabold text-3xl md:text-5xl lg:text-6xl tracking-tight uppercase transition-colors duration-300 leading-none">
              <span className="text-[var(--neu-text)] mr-3 md:mr-5">TO</span>
              <span className="bg-gradient-to-r from-[#b8791f] via-[#d9921f] to-[#f0a838] dark:from-[#f0a838] dark:via-[#ffd67a] dark:to-[#b8791f] bg-clip-text text-transparent drop-shadow-sm">
                CLARITY
              </span>
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

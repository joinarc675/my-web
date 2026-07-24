import { motion } from 'framer-motion';
import coursePoster from '../assets/course-poster.webp';
import { Sparkles, Clock, BookOpen, MessageCircle } from 'lucide-react';

export default function Courses() {
  const handleNotifyClick = () => {
    const message = encodeURIComponent('Hello! I would like to get updates about the upcoming course "Quran & Life Batch 02".');
    window.open(`https://wa.me/+923458612538?text=${message}`, '_blank');
  };

  return (
    <section id="courses" className="py-16 md:py-20 bg-[var(--neu-base)] transition-colors duration-300 relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--neu-accent)]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <motion.div
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--neu-accent)] bg-[var(--neu-accent)]/10 rounded-full border border-[var(--neu-border)] transition-colors duration-300">
            <Sparkles className="w-3.5 h-3.5" />
            Learning & Growth
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--neu-text)] transition-colors duration-300">
            Upcoming <span className="text-[var(--neu-accent)]">Courses</span>
          </h2>
          <p className="text-base md:text-lg text-[var(--neu-text-muted)] max-w-2xl mx-auto transition-colors duration-300">
            Transformative Islamic learning, self-development, and practical guidance for life’s challenges.
          </p>
        </motion.div>

        {/* Course Card Grid */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="group relative bg-[var(--neu-card-bg)] border border-[var(--neu-border)] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:border-[var(--neu-accent)] flex flex-col md:flex-row items-stretch"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Poster Image */}
            <div className="md:w-1/2 relative min-h-[300px] md:min-h-[380px] overflow-hidden bg-black/20">
              <img
                src={coursePoster}
                alt="Quran & Life Batch 02 — Course Poster by Abdul Rehman Cheema"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Badge overlay */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[var(--neu-base)] bg-[var(--neu-accent)] rounded-full shadow-lg">
                <Clock className="w-3.5 h-3.5" />
                Coming Soon
              </div>
            </div>

            {/* Content Details */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--neu-accent)] uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  Live Cohort & Sessions
                </div>

                <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--neu-text)] transition-colors duration-300 leading-tight">
                  Quran &amp; Life <span className="text-[var(--neu-accent)]">Batch 02</span>
                </h3>

                <p className="text-sm md:text-base leading-relaxed text-[var(--neu-text-muted)] transition-colors duration-300">
                  An interactive journey connecting timeless Quranic principles with modern emotional wellness, relationship dynamics, and practical life navigation.
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-semibold bg-[var(--neu-base)] border border-[var(--neu-border)] text-[var(--neu-text-muted)] rounded-lg">
                    Interactive Live Sessions
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold bg-[var(--neu-base)] border border-[var(--neu-border)] text-[var(--neu-text-muted)] rounded-lg">
                    Q&amp;A &amp; Personal Insights
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleNotifyClick}
                  className="w-full flex items-center justify-center gap-2 font-bold py-3.5 px-6 rounded-xl bg-[var(--neu-accent)]/15 hover:bg-[var(--neu-accent)] text-[var(--neu-accent)] hover:text-[var(--neu-base)] border border-[var(--neu-accent)] transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  Get Notified / Express Interest
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

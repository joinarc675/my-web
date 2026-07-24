import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import coursePoster from '../assets/course-poster.webp';
import { Sparkles, Clock, BookOpen, MessageCircle, Star, X, CheckCircle2, Video, FileText, ArrowRight } from 'lucide-react';

const BATCH_1_REVIEWS = [
  {
    id: 1,
    name: 'Hira M.',
    location: 'Lahore, Pakistan',
    rating: 5,
    review: 'Quran & Life Batch 01 completely transformed how I navigate daily emotional stress. Connecting Quranic verses with real psychology brought so much peace to my life!',
  },
  {
    id: 2,
    name: 'Saad K.',
    location: 'Islamabad, Pakistan',
    rating: 5,
    review: 'Abdul Rehman Cheema’s method of blending neuroscience, Shariah, and practical life advice is unmatched. The recorded lectures and detailed PDF notes were extremely valuable.',
  },
  {
    id: 3,
    name: 'Amina & Bilal',
    location: 'UK (Online)',
    rating: 5,
    review: 'Batch 1 helped us untangle so many subtle communication issues in our marriage. The live Q&A sessions gave us immense clarity. Cannot recommend this course enough!',
  },
  {
    id: 4,
    name: 'Dr. Faisal R.',
    location: 'Karachi, Pakistan',
    rating: 5,
    review: 'As a healthcare professional, I loved how grounded and practical the framework was. Perfect balance of spiritual guidance and scientific insight.',
  },
];

export default function Courses() {
  const navigate = useNavigate();
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  const handleEnrollClick = () => {
    navigate('/booking', { state: { selectedPackageId: 'quran-life-batch-02' } });
  };

  const handleWhatsappClick = () => {
    const message = encodeURIComponent('Hello! I am interested in enrolling in "Quran & Life Batch 02". Please share more details.');
    window.open(`https://wa.me/+923458612538?text=${message}`, '_blank');
  };

  return (
    <section id="courses" className="py-16 md:py-24 bg-[var(--neu-base)] transition-colors duration-300 relative overflow-hidden">
      {/* Background Glow Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[var(--neu-accent)]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--neu-accent)] bg-[var(--neu-accent)]/10 rounded-full border border-[var(--neu-border)] transition-colors duration-300">
            <Sparkles className="w-3.5 h-3.5" />
            Live Cohort Course
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--neu-text)] transition-colors duration-300">
            Upcoming <span className="text-[var(--neu-accent)]">Courses</span>
          </h2>
          <p className="text-base md:text-lg text-[var(--neu-text-muted)] max-w-2xl mx-auto transition-colors duration-300">
            Transformative Islamic learning, personal growth, and practical Quranic wisdom for everyday life.
          </p>
        </motion.div>

        {/* Main Course Card */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="group relative bg-[var(--neu-card-bg)] border-2 border-[var(--neu-accent)]/40 hover:border-[var(--neu-accent)] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col md:flex-row items-stretch"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Poster Image Column */}
            <div className="md:w-1/2 relative min-h-[340px] md:min-h-[420px] overflow-hidden bg-black/30">
              <img
                src={coursePoster}
                alt="Quran & Life Batch 02 — Course Poster by Abdul Rehman Cheema"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              
              {/* Coming Soon & Pricing Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[var(--neu-base)] bg-[var(--neu-accent)] rounded-full shadow-lg">
                  <Clock className="w-3.5 h-3.5" />
                  Coming Soon
                </span>
                <span className="px-3 py-1 text-xs font-black tracking-wider text-white bg-black/60 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
                  PKR 5,000
                </span>
              </div>
            </div>

            {/* Course Information Column */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--neu-accent)] uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  Batch 02 · Registration Open
                </div>

                <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--neu-text)] transition-colors duration-300 leading-tight">
                  Quran &amp; Life <span className="text-[var(--neu-accent)]">Batch 02</span>
                </h3>

                <p className="text-sm md:text-base leading-relaxed text-[var(--neu-text-muted)] transition-colors duration-300">
                  An interactive journey connecting Quranic wisdom with modern emotional resilience, personal growth, and practical life navigation.
                </p>

                {/* Highlights List */}
                <div className="space-y-2 pt-1 text-xs md:text-sm font-semibold text-[var(--neu-text)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--neu-accent)] flex-shrink-0" />
                    <span>Live Interactive Cohort Sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[var(--neu-accent)] flex-shrink-0" />
                    <span><strong>Recorded lectures</strong> provided for every class</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--neu-accent)] flex-shrink-0" />
                    <span>Comprehensive <strong>PDF notes &amp; reading material</strong></span>
                  </div>
                </div>
              </div>

              {/* Pricing & CTA Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase font-bold text-[var(--neu-text-muted)]">Enrollment Fee</span>
                  <span className="text-2xl font-black text-[var(--neu-accent)]">PKR 5,000</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Enroll Package Button */}
                  <button
                    onClick={handleEnrollClick}
                    className="w-full flex items-center justify-center gap-2 font-extrabold py-3 px-4 rounded-xl bg-[var(--neu-accent)] text-[var(--neu-base)] hover:opacity-90 transition-all duration-300 cursor-pointer shadow-md text-sm border-none"
                  >
                    Enroll Now
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Batch 1 Reviews Button */}
                  <button
                    onClick={() => setShowReviewsModal(true)}
                    className="w-full flex items-center justify-center gap-2 font-extrabold py-3 px-4 rounded-xl bg-[var(--neu-card-bg)] text-[var(--neu-text)] hover:text-[var(--neu-accent)] border border-[var(--neu-border)] hover:border-[var(--neu-accent)] transition-all duration-300 cursor-pointer text-sm"
                  >
                    <Star className="w-4 h-4 fill-[var(--neu-accent)] text-[var(--neu-accent)]" />
                    Batch 1 Reviews
                  </button>
                </div>

                {/* WhatsApp secondary inquiry */}
                <button
                  onClick={handleWhatsappClick}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[var(--neu-text-muted)] hover:text-[var(--neu-accent)] transition-colors duration-200 cursor-pointer bg-transparent border-none py-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Questions? Inquire on WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Batch 1 Reviews Modal */}
      <AnimatePresence>
        {showReviewsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              className="relative w-full max-w-2xl bg-[var(--neu-card-bg)] border border-[var(--neu-border)] rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--neu-border)] mb-4">
                <div>
                  <div className="flex items-center gap-1 text-[var(--neu-accent)] mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-[var(--neu-accent)]" />
                    ))}
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-[var(--neu-text)]">
                    Quran &amp; Life <span className="text-[var(--neu-accent)]">Batch 01 Reviews</span>
                  </h3>
                </div>
                <button
                  onClick={() => setShowReviewsModal(false)}
                  className="p-2 rounded-lg text-[var(--neu-text-muted)] hover:text-[var(--neu-text)] bg-[var(--neu-base)] border border-[var(--neu-border)] cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Reviews List */}
              <div className="overflow-y-auto space-y-4 pr-1">
                {BATCH_1_REVIEWS.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-[var(--neu-base)] border border-[var(--neu-border)] space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[var(--neu-text)] text-sm">{rev.name}</h4>
                      <span className="text-xs text-[var(--neu-text-muted)]">{rev.location}</span>
                    </div>
                    <p className="text-xs md:text-sm leading-relaxed text-[var(--neu-text-muted)] italic">
                      &ldquo;{rev.review}&rdquo;
                    </p>
                  </div>
                ))}
              </div>

              {/* Modal Footer CTA */}
              <div className="pt-4 border-t border-[var(--neu-border)] mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--neu-text-muted)]">
                  Ready for Batch 02?
                </span>
                <button
                  onClick={() => {
                    setShowReviewsModal(false);
                    handleEnrollClick();
                  }}
                  className="px-5 py-2.5 text-xs font-extrabold rounded-lg bg-[var(--neu-accent)] text-[var(--neu-base)] border-none cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Enroll in Batch 02 (PKR 5,000)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

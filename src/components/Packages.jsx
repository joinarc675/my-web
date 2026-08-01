import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const packages = [
  {
    id: '60min',
    name: '60 Minute Session',
    description: 'A focused, one-on-one session to address immediate concerns and find actionable coping strategies.',
    duration: '1 Session / 60 Mins',
    isPopular: false,
    features: [
      'Full private 1:1 session',
      'Safe, confidential space',
      'Clarity on stress, anxiety, or relationship struggles',
      'Personalized direction forward',
      'Perfect for first-time clients',
    ],
  },
  {
    id: '3sessions',
    name: '3 Sessions Package',
    description: 'Deep-dive counselling to unpack emotional blocks, establish therapeutic goals, and build resilience.',
    duration: '3 Sessions',
    isPopular: true,
    features: [
      'Three full private sessions',
      'Continuity for deeper emotional exploration',
      'Greater clarity on complex challenges',
      'Ideal for relationship or personal breakthroughs',
      'Structured progress across sessions',
    ],
  },
  {
    id: 'urgent',
    name: 'Urgent Session',
    description: 'Priority booking within 24 hours for acute distress, critical life events, or sudden relationship issues.',
    duration: '1 Session / Priority',
    isPopular: false,
    features: [
      'Priority booking for immediate support',
      'Direct access when timing matters most',
      'Fast clarity during emotional overwhelm',
      'Ideal for betrayal discovery, heartbreak, or sudden crisis',
      'Calm, direction, and immediate guidance',
    ],
  },
  {
    id: '5sessions',
    name: '5 Sessions Package',
    description: 'Comprehensive therapy plan exploring core behaviors, relationship dynamics, and lasting solutions.',
    duration: '5 Sessions',
    isPopular: false,
    features: [
      'Five structured private sessions',
      'Deep behavioral and emotional exploration',
      'Relationship dynamics and conflict resolution',
      'Lasting tools for long-term well-being',
      'Best value for ongoing support',
    ],
  },
  {
    id: 'physical',
    name: 'Physical Meeting',
    description: 'In-person premium consultation at our office, providing a safe, direct, and collaborative healing environment.',
    duration: '1 In-Person Session',
    isPopular: false,
    recommended: true,
    features: [
      'Face-to-face private consultation',
      'Premium in-person therapeutic space',
      'Ideal for couples or sensitive matters',
      'Direct, personal human connection',
      'Available by appointment only',
    ],
  },
  {
    id: 'invite-us',
    name: 'Invite Us (Motivational Lecture)',
    description: 'Invite Abdul Rehman Cheema to your office, university, school, or college for an empowering motivational lecture & interactive session.',
    duration: 'Office / Campus Event',
    isPopular: false,
    isLecture: true,
    features: [
      'Available for Offices, Universities, Schools & Colleges',
      'Tailored motivational lectures & leadership keynotes',
      'Islamic wisdom, emotional resilience & self-growth',
      'Live Q&A and interactive audience engagement',
      'Customized topics based on your institution’s needs',
    ],
  },
  {
    id: 'quran-life-batch-02',
    name: 'Quran & Life Batch 02 (Course)',
    description: 'Live interactive cohort course bridging Quranic principles with emotional resilience. Classes on Friday, Saturday & Sunday. Recorded lectures & PDF notes included.',
    duration: 'Full Course Cohort',
    price: 'PKR 100',
    isPopular: false,
    isCourse: true,
    features: [
      'Classes on Friday, Saturday & Sunday',
      'Live interactive cohort sessions',
      'Recorded lectures provided after every class',
      'Comprehensive PDF study notes & reading material',
      'Direct Q&A with Abdul Rehman Cheema',
      'Community access & continuous support',
    ],
  },
];

export default function Packages() {
  const navigate = useNavigate();
  return (
    <section id="packages" className="py-16 bg-[var(--neu-base)] transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          className="text-center space-y-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--neu-text)] transition-colors duration-300">
            Where To{' '}
            <span className="font-display text-[var(--neu-accent)] tracking-wider transition-colors duration-300">
              Start
            </span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-[var(--neu-text-muted)] transition-colors duration-300">
            Choose the level of{' '}
            <span className="font-bold text-[var(--neu-accent)] transition-colors duration-300">support</span>{' '}
            that best fits your current needs and journey.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-10 items-stretch">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              className={`relative flex flex-col w-full md:w-[calc(50%-20px)] lg:w-[calc(33.333%-27px)] max-w-[380px] p-8 rounded-xl bg-[var(--neu-card-bg)] border ${pkg.isPopular || pkg.recommended
                ? 'border-[var(--neu-accent)] shadow-[0_0_20px_rgba(184,121,31,0.08)] dark:shadow-[0_0_20px_rgba(240,168,56,0.15)]'
                : 'border-[var(--neu-border)]'
                } transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Most Popular badge */}
              {pkg.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="neu-badge font-bold transition-colors duration-300">Most Popular</span>
                </div>
              )}

              {/* Recommended by ARC badge */}
              {pkg.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="neu-badge font-bold whitespace-nowrap transition-colors duration-300">Recommended by ARC</span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2 text-[var(--neu-text)] transition-colors duration-300">
                  {pkg.name}
                </h3>
                <p className="text-sm min-h-[3.5rem] leading-relaxed text-[var(--neu-text-muted)] transition-colors duration-300">
                  {pkg.description}
                </p>
              </div>

              <div className="mb-6">
                {pkg.price && (
                  <div className="text-2xl font-extrabold text-[var(--neu-text)] mb-1 transition-colors duration-300">
                    {pkg.price}
                  </div>
                )}
                <div className="text-sm font-bold text-[var(--neu-accent)] transition-colors duration-300">
                  {pkg.duration}
                </div>
              </div>

              {/* Features List */}
              {pkg.features && pkg.features.length > 0 && (
                <div className="mb-8 pt-4 border-t border-[var(--neu-border)] transition-colors duration-300 flex-1">
                  <ul className="space-y-2.5 text-left">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs md:text-sm text-[var(--neu-text-muted)]">
                        <Check className="w-4 h-4 text-[var(--neu-accent)] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-auto pt-6 border-t border-[var(--neu-border)] transition-colors duration-300">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/booking', { state: { selectedPackageId: pkg.id } })}
                  className={`w-full py-3 px-4 font-extrabold cursor-pointer transition-all duration-300 border-none ${pkg.isPopular || pkg.recommended ? 'neu-btn-primary' : 'neu-btn'
                    }`}
                >
                  {pkg.isCourse ? 'Enroll Now' : 'Choose This Package'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

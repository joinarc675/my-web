import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import Navbar from './Navbar';

const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    body: 'By accessing or using the website at abdulrehmancheema.com ("Website"), you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please discontinue use of the Website immediately.',
  },
  {
    title: 'Services Provided',
    body: 'Abdul Rehman Cheema (ARC) provides Islamic counselling, psychological guidance, and related educational content through this Website. Sessions may be conducted online or in-person. The services are intended for individuals seeking personal development, relationship guidance, and emotional well-being support grounded in Islamic principles.',
  },
  {
    title: 'Booking & Appointments',
    subsections: [
      {
        heading: 'Booking Requests',
        body: 'All session bookings made through the Website are requests and are subject to confirmation by our team. A booking is not confirmed until you receive an explicit confirmation from us.',
      },
      {
        heading: 'Cancellation Policy',
        body: 'Cancellations must be made at least 24 hours before the scheduled session. Late cancellations or no-shows may result in forfeiture of the session fee. In exceptional circumstances, please contact us directly.',
      },
      {
        heading: 'Rescheduling',
        body: 'You may request to reschedule a session by contacting us at least 24 hours in advance, subject to availability.',
      },
    ],
  },
  {
    title: 'Payments & Refunds',
    subsections: [
      {
        heading: 'Payment Details',
        body: 'Payment instructions and details are shared directly with clients upon booking request confirmation. Sessions are confirmed after payment is completed.',
      },
      {
        heading: 'Refund Policy',
        body: 'Refunds are considered on a case-by-case basis. If a session is cancelled by us, a full refund will be issued. If a session is cancelled by the client outside the 24-hour window, a refund may be granted at our discretion. Fees are non-refundable for no-shows or late cancellations.',
      },
    ],
  },
  {
    title: 'Confidentiality',
    body: 'All information shared during counselling sessions is treated with the utmost confidentiality. We do not disclose personal information or session details to third parties, except where required by law or to prevent imminent harm. Our commitment to your privacy is fundamental to the therapeutic relationship.',
  },
  {
    title: 'Professional Limitations',
    body: 'Abdul Rehman Cheema is a counsellor and is not a licensed medical doctor or psychiatrist. The guidance provided does not constitute medical advice or psychiatric treatment. For medical emergencies or severe mental health crises, please contact a licensed medical professional or emergency services immediately.',
  },
  {
    title: 'Intellectual Property',
    body: 'All content on this Website — including text, graphics, logos, images, and audio/video material — is the intellectual property of Abdul Rehman Cheema or its licensors. You may not reproduce, distribute, or use any content without prior written permission.',
  },
  {
    title: 'User Conduct',
    body: 'You agree to use this Website lawfully and respectfully. You must not submit false information, engage in any harmful or abusive communication, attempt to gain unauthorized access to any part of the Website, or use the Website for any commercial purpose without our consent.',
  },
  {
    title: 'Disclaimer of Warranties',
    body: 'The Website and its services are provided "as is" without warranties of any kind, express or implied. We do not guarantee that the Website will be uninterrupted, error-free, or free of viruses. Counselling outcomes depend on individual effort and circumstances, and we make no guarantees of specific results.',
  },
  {
    title: 'Limitation of Liability',
    body: 'To the fullest extent permitted by law, Abdul Rehman Cheema shall not be liable for any indirect, incidental, or consequential damages arising from the use of, or inability to use, the Website or its services. Our total liability shall not exceed the amount paid for the specific session in question.',
  },
  {
    title: 'Third-Party Links',
    body: 'The Website may contain links to third-party websites for informational purposes. We are not responsible for the content, privacy practices, or policies of any external websites. Accessing third-party links is at your own risk.',
  },
  {
    title: 'Governing Law',
    body: 'These Terms & Conditions are governed by and construed in accordance with the laws of Pakistan. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Pakistan.',
  },
  {
    title: 'Changes to Terms',
    body: 'We reserve the right to modify these Terms & Conditions at any time. Changes will be posted on this page with an updated effective date. Continued use of the Website following any changes constitutes your acceptance of the revised terms.',
  },
  {
    title: 'Contact Us',
    body: 'If you have any questions about these Terms & Conditions, please contact us via our website at https://abdulrehmancheema.com/ or reach us directly through WhatsApp or email listed on the Contact page.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: 'easeOut' },
  }),
};

export default function TermsAndConditions() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Terms & Conditions — Abdul Rehman Cheema (ARC)";
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--neu-base)] text-[var(--neu-text)] transition-colors duration-300">
      <Navbar />
      <div className="container mx-auto px-6 md:px-12 max-w-3xl">

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 mb-10 text-sm font-semibold transition-colors duration-300 text-[var(--neu-text-muted)] hover:text-[var(--neu-accent)] cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--neu-accent)]/10 border border-[var(--neu-accent)]/30 mb-6">
            <FileText className="w-8 h-8 text-[var(--neu-accent)]" />
          </div>
          <span className="block text-xs font-bold uppercase tracking-widest text-[var(--neu-accent)] mb-3">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--neu-text)] leading-tight mb-4">
            Terms &amp;{' '}
            <span className="font-display text-[var(--neu-accent)] tracking-wider">
              Conditions
            </span>
          </h1>
          <p className="text-sm text-[var(--neu-text-muted)] max-w-lg mx-auto leading-relaxed">
            Please read these terms carefully before using{' '}
            <strong className="text-[var(--neu-text)]">abdulrehmancheema.com</strong>. By
            accessing this website you agree to be bound by the following terms.
          </p>
          <p className="text-xs text-[var(--neu-text-faint)] mt-4">
            Website:{' '}
            <a
              href="https://abdulrehmancheema.com/"
              className="text-[var(--neu-accent)] hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              https://abdulrehmancheema.com/
            </a>
          </p>
        </motion.div>

        {/* T&C Sections */}
        <div className="space-y-4">
          {SECTIONS.map((section, i) => (
            <motion.div
              key={section.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="p-6 rounded-xl bg-[var(--neu-card-bg)] border border-[var(--neu-border)] transition-colors duration-300"
            >
              <h2 className="text-base font-bold text-[var(--neu-text)] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-[var(--neu-accent)] flex-shrink-0" />
                {section.title}
              </h2>

              {section.subsections ? (
                <div className="space-y-4">
                  {section.subsections.map((sub) => (
                    <div key={sub.heading}>
                      <h3 className="text-sm font-semibold text-[var(--neu-text)] mb-1">
                        {sub.heading}
                      </h3>
                      <p className="text-sm text-[var(--neu-text-muted)] leading-relaxed">
                        {sub.body}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--neu-text-muted)] leading-relaxed">
                  {section.body}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-xs text-[var(--neu-text-faint)] mt-12"
        >
          Last updated: July 2026 &mdash; abdulrehmancheema.com
        </motion.p>

      </div>
    </div>
  );
}

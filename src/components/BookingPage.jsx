import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase, MessageSquare, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import Navbar from './Navbar';
import { supabase } from '../lib/supabaseClient';
import { trackLead } from '../lib/pixel';

const PACKAGES = [
  {
    id: '60min',
    name: '60 Minute Session',
    description: 'A safe first conversation to explore what you are carrying and whether we are the right fit.',
    duration: '60 Minutes',
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
    description: 'More time to go deeper when you are navigating complex emotions or need space to untangle something heavy.',
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
    description: 'For those moments when you cannot wait and need someone who understands.',
    duration: 'Priority Access · 60 Minutes',
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
    description: 'In-person premium consultation providing a safe, direct, and collaborative healing environment.',
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
    name: 'Invite Us',
    description: 'Invite Abdul Rehman Cheema to your office, university, school, or college for an empowering motivational lecture & interactive seminar.',
    duration: 'Office / Campus Event',
    isPopular: false,
    recommended: false,
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
    name: 'Quran & Life Batch 02',
    description: 'Full enrollment for Quran & Life Batch 02 live cohort course by Abdul Rehman Cheema. Classes held on Friday, Saturday & Sunday.',
    duration: 'Live Cohort Course (Fri, Sat & Sun)',
    price: 'PKR 100',
    isPopular: false,
    recommended: false,
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

const PROBLEM_OPTIONS = [
  'Self Development',
  'Relationship Issues',
  'Marital Challenges',
  'Purposeful Parenting',
  'Spiritual Hollowness',
  'Something else (type below)',
];

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Get pre-selected package ID from navigation state
  const initialPackageId = location.state?.selectedPackageId || '';

  // Form states
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [profession, setProfession] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedProblemOption, setSelectedProblemOption] = useState('');
  const [customProblem, setCustomProblem] = useState('');
  const [briefProblem, setBriefProblem] = useState('');

  // Validation and UI states
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Set package selection if navigating with state & update page title
  useEffect(() => {
    document.title = "Book a Session — Abdul Rehman Cheema (ARC)";
    if (initialPackageId) {
      const found = PACKAGES.find(p => p.id === initialPackageId);
      if (found) {
        setSelectedPackage(found);
      }
    }
  }, [initialPackageId]);

  // Scroll to Form section helper
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!selectedPackage) {
      newErrors.package = 'Please select a session / package first.';
    }

    if (!fullName.trim()) {
      newErrors.fullName = 'Name is required.';
    }

    if (!whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required.';
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(whatsappNumber.trim())) {
      newErrors.whatsappNumber = 'Please enter a valid WhatsApp number.';
    }

    if (email.trim() && !/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (age && (isNaN(age) || parseInt(age, 10) <= 0 || parseInt(age, 10) > 120)) {
      newErrors.age = 'Please enter a valid age.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      scrollToForm();
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Prepare payload with exact required columns (no price in payload for DB)
      const bookingPayload = {
        package_id: selectedPackage.id,
        package_name: selectedPackage.name,
        name: fullName.trim(),
        email: email.trim() || null,
        age: age ? parseInt(age, 10) : null,
        city: city.trim() || null,
        profession: profession.trim() || null,
        whatsapp_number: whatsappNumber.trim(),
        brief_problem: briefProblem.trim() || null,
      };

      // Insert into public.bookings
      const { error: insertError } = await supabase
        .from('bookings')
        .insert([bookingPayload]);

      if (insertError) {
        throw new Error(`Booking submission failed: ${insertError.message}`);
      }

      console.log('--- ARC BOOKING SUBMISSION PAYLOAD ---');
      console.log(JSON.stringify(bookingPayload, null, 2));
      console.log('--------------------------------------');

      // Trigger Meta Pixel Lead Event
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: selectedPackage.name,
        });
      } else {
        trackLead({
          content_name: selectedPackage.name,
        });
      }

      setSubmittedData({
        packageName: selectedPackage.name,
        fullName: fullName.trim(),
        whatsappNumber: whatsappNumber.trim(),
      });
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Supabase booking error:', err);
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-6 sm:pt-20 sm:pb-16 bg-[var(--neu-base)] text-[var(--neu-text)] transition-colors duration-300">
      <Navbar />
      <div className="container mx-auto px-3 sm:px-6 md:px-12 max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1 mb-1.5 sm:mb-6 text-[11px] sm:text-xs font-semibold transition-colors duration-300 text-[var(--neu-text-muted)] hover:text-[var(--neu-accent)] cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Back to Home
        </button>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center py-8 px-4 sm:py-14 sm:px-8 rounded-xl bg-[var(--neu-card-bg)] border border-[var(--neu-accent)] shadow-[0_0_30px_rgba(240,168,56,0.15)]"
          >
            <CheckCircle className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-5 text-[var(--neu-accent)]" />
            <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 font-heading text-[var(--neu-text)]">
              Booking Request Received!
            </h2>
            <p className="text-xs sm:text-sm text-[var(--neu-text-muted)] leading-relaxed mb-4 sm:mb-6">
              Thank you, <span className="font-bold text-[var(--neu-text)]">{submittedData?.fullName}</span>.
              We have received your request for <span className="font-semibold text-[var(--neu-accent)]">{submittedData?.packageName}</span>.
              Our team will reach out to you on WhatsApp (<span className="font-semibold text-[var(--neu-text)]">{submittedData?.whatsappNumber}</span>) shortly.
            </p>
            <button
              onClick={() => navigate('/')}
              className="neu-btn px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm cursor-pointer"
            >
              Return Home
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-6">

            {/* Header */}
            <div className="text-center space-y-0.5 sm:space-y-2">
              <h1 className="text-lg sm:text-3xl md:text-4xl font-extrabold text-[var(--neu-text)]">
                Book Your{' '}
                <span className="font-display text-[var(--neu-accent)] tracking-wider">
                  Session
                </span>
              </h1>
            </div>

            {/* Supabase Error Banner */}
            {submitError && (
              <div className="p-2 sm:p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-[var(--neu-text)] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[var(--neu-accent)] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-[var(--neu-accent)]">Submission Error:</strong>
                  <p className="text-[10px] text-[var(--neu-text-muted)] mt-0.5">{submitError}</p>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {Object.keys(errors).length > 0 && (
              <div className="p-2 sm:p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-[var(--neu-text)] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[var(--neu-accent)] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-[var(--neu-accent)]">Please correct errors:</strong>
                  <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-[10px] text-[var(--neu-text-muted)]">
                    {Object.values(errors).map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* CLIENT DETAILS & SESSION SELECTION FORM */}
            <div ref={formRef} className="space-y-2 sm:space-y-4">

              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {/* Name */}
                <div className="col-span-1 space-y-1">
                  <label htmlFor="fullName" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--neu-text-muted)] flex items-center gap-1">
                    <User className="w-3 h-3 text-[var(--neu-accent)]" /> Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (e.target.value.trim()) {
                        setErrors(prev => {
                          const copy = { ...prev };
                          delete copy.fullName;
                          return copy;
                        });
                      }
                    }}
                    placeholder="Full name"
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg bg-[var(--neu-card-bg)] border border-[var(--neu-border)] text-xs sm:text-sm text-[var(--neu-text)] focus:outline-none focus:border-[var(--neu-accent)] focus:ring-1 focus:ring-[var(--neu-accent)] transition-all"
                  />
                  {errors.fullName && (
                    <p className="text-[10px] text-amber-500/90 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* WhatsApp Number */}
                <div className="col-span-1 space-y-1">
                  <label htmlFor="whatsappNumber" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--neu-text-muted)] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[var(--neu-accent)]" /> WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    value={whatsappNumber}
                    onChange={(e) => {
                      setWhatsappNumber(e.target.value);
                      if (e.target.value.trim()) {
                        setErrors(prev => {
                          const copy = { ...prev };
                          delete copy.whatsappNumber;
                          return copy;
                        });
                      }
                    }}
                    placeholder="+92 300 1234567"
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg bg-[var(--neu-card-bg)] border border-[var(--neu-border)] text-xs sm:text-sm text-[var(--neu-text)] focus:outline-none focus:border-[var(--neu-accent)] focus:ring-1 focus:ring-[var(--neu-accent)] transition-all"
                  />
                  {errors.whatsappNumber && (
                    <p className="text-[10px] text-amber-500/90 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.whatsappNumber}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="col-span-1 space-y-1">
                  <label htmlFor="email" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--neu-text-muted)] flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[var(--neu-accent)]" /> Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors(prev => {
                          const copy = { ...prev };
                          delete copy.email;
                          return copy;
                        });
                      }
                    }}
                    placeholder="email@example.com"
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg bg-[var(--neu-card-bg)] border border-[var(--neu-border)] text-xs sm:text-sm text-[var(--neu-text)] focus:outline-none focus:border-[var(--neu-accent)] focus:ring-1 focus:ring-[var(--neu-accent)] transition-all"
                  />
                  {errors.email && (
                    <p className="text-[10px] text-amber-500/90 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Age */}
                <div className="col-span-1 space-y-1">
                  <label htmlFor="age" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--neu-text-muted)] flex items-center gap-1">
                    <User className="w-3 h-3 text-[var(--neu-accent)]" /> Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                      if (errors.age) {
                        setErrors(prev => {
                          const copy = { ...prev };
                          delete copy.age;
                          return copy;
                        });
                      }
                    }}
                    placeholder="e.g. 28"
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg bg-[var(--neu-card-bg)] border border-[var(--neu-border)] text-xs sm:text-sm text-[var(--neu-text)] focus:outline-none focus:border-[var(--neu-accent)] focus:ring-1 focus:ring-[var(--neu-accent)] transition-all"
                  />
                  {errors.age && (
                    <p className="text-[10px] text-amber-500/90 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.age}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="col-span-1 space-y-1">
                  <label htmlFor="city" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--neu-text-muted)] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[var(--neu-accent)]" /> City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lahore"
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg bg-[var(--neu-card-bg)] border border-[var(--neu-border)] text-xs sm:text-sm text-[var(--neu-text)] focus:outline-none focus:border-[var(--neu-accent)] focus:ring-1 focus:ring-[var(--neu-accent)] transition-all"
                  />
                </div>

                {/* Profession */}
                <div className="col-span-1 space-y-1">
                  <label htmlFor="profession" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--neu-text-muted)] flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-[var(--neu-accent)]" /> Profession
                  </label>
                  <input
                    type="text"
                    id="profession"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Engineer"
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg bg-[var(--neu-card-bg)] border border-[var(--neu-border)] text-xs sm:text-sm text-[var(--neu-text)] focus:outline-none focus:border-[var(--neu-accent)] focus:ring-1 focus:ring-[var(--neu-accent)] transition-all"
                  />
                </div>

                {/* Select Session / Package (Single Card with 2-Column Grid) */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--neu-text-muted)] flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-[var(--neu-accent)]" /> Select Session / Package <span className="text-red-500">*</span>
                    </span>
                    {errors.package && (
                      <span className="text-[10px] sm:text-xs text-amber-500 font-normal flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.package}
                      </span>
                    )}
                  </label>

                  {/* ONE Single Card Container wrapping 2-column grid on all screen sizes */}
                  <div className="rounded-lg sm:rounded-xl bg-[var(--neu-card-bg)] border border-[var(--neu-border)] p-1 sm:p-2 shadow-xs">
                    <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
                      {PACKAGES.map((pkg) => {
                        const isSelected = selectedPackage?.id === pkg.id;
                        return (
                          <div
                            key={pkg.id}
                            onClick={() => {
                              setSelectedPackage(pkg);
                              setErrors(prev => {
                                const copy = { ...prev };
                                delete copy.package;
                                return copy;
                              });
                            }}
                            className={`flex items-center justify-between px-2 py-1.5 sm:px-3 sm:py-2.5 rounded-md sm:rounded-lg transition-colors duration-150 cursor-pointer ${isSelected
                              ? 'bg-[var(--neu-accent)]/15 text-[var(--neu-accent)] font-semibold'
                              : 'hover:bg-[var(--neu-base)]/40 text-[var(--neu-text)]'
                              }`}
                          >
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                              {/* Radio Circle */}
                              <div
                                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${isSelected
                                  ? 'border-[var(--neu-accent)] bg-[var(--neu-accent)]'
                                  : 'border-gray-400 dark:border-gray-500 bg-transparent'
                                  }`}
                              >
                                {isSelected && <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[var(--neu-base)]" />}
                              </div>

                              <span className="text-[10px] sm:text-xs font-medium leading-tight truncate">
                                {pkg.name}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Brief Problem / Reason for Booking (Single Card with 3-Column Grid) */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--neu-text-muted)] flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-[var(--neu-accent)]" /> Brief Problem / Reason for Booking
                    </span>
                  </label>

                  {/* ONE Single Card Container wrapping 2-column grid on all screen sizes */}
                  <div className="rounded-lg sm:rounded-xl bg-[var(--neu-card-bg)] border border-[var(--neu-border)] p-1 sm:p-2 shadow-xs">
                    <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
                      {PROBLEM_OPTIONS.map((opt) => {
                        const isSelected = selectedProblemOption === opt;
                        return (
                          <div
                            key={opt}
                            onClick={() => {
                              setSelectedProblemOption(opt);
                              if (opt !== 'Something else (type below)') {
                                setBriefProblem(opt);
                              } else {
                                setBriefProblem(customProblem);
                              }
                            }}
                            className={`flex items-center justify-between px-2 py-1.5 sm:px-3 sm:py-2.5 rounded-md sm:rounded-lg transition-colors duration-150 cursor-pointer ${isSelected
                              ? 'bg-[var(--neu-accent)]/15 text-[var(--neu-accent)] font-semibold'
                              : 'hover:bg-[var(--neu-base)]/40 text-[var(--neu-text)]'
                              }`}
                          >
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                              {/* Radio Circle */}
                              <div
                                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${isSelected
                                  ? 'border-[var(--neu-accent)] bg-[var(--neu-accent)]'
                                  : 'border-gray-400 dark:border-gray-500 bg-transparent'
                                  }`}
                              >
                                {isSelected && <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[var(--neu-base)]" />}
                              </div>

                              <span className="text-[10px] sm:text-xs font-medium leading-tight">
                                {opt}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Text Input if 'Something else' is selected */}
                  {selectedProblemOption === 'Something else (type below)' && (
                    <div className="pt-1">
                      <input
                        type="text"
                        value={customProblem}
                        onChange={(e) => {
                          setCustomProblem(e.target.value);
                          setBriefProblem(e.target.value);
                        }}
                        placeholder="Please type your concern or details here…"
                        className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg bg-[var(--neu-card-bg)] border border-[var(--neu-border)] text-xs sm:text-sm text-[var(--neu-text)] focus:outline-none focus:border-[var(--neu-accent)] focus:ring-1 focus:ring-[var(--neu-accent)] transition-all"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-1.5 sm:pt-3 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 sm:px-10 sm:py-3 rounded-lg text-xs sm:text-sm font-extrabold cursor-pointer transition-all duration-300 neu-btn-primary disabled:opacity-50 disabled:cursor-not-allowed border-none"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </div>

          </form>
        )}
      </div>

      {/* Sticky Bottom Summary Bar */}
      <AnimatePresence>
        {selectedPackage && !isSubmitted && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--neu-card-bg)] border-t border-[var(--neu-border)] py-2 px-3 sm:py-4 sm:px-6 md:px-12 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] flex flex-row items-center justify-between gap-2"
          >
            <div>
              <span className="text-[8px] sm:text-[10px] uppercase font-bold text-[var(--neu-accent)] tracking-wider block">Selected Package</span>
              <strong className="text-xs sm:text-sm md:text-base font-bold text-[var(--neu-text)]">{selectedPackage.name}</strong>
            </div>

            <button
              onClick={scrollToForm}
              className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold bg-[var(--neu-accent)] hover:bg-[var(--neu-accent-hover)] text-[var(--neu-base)] transition-colors cursor-pointer shadow-md border-none shrink-0"
            >
              Submit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

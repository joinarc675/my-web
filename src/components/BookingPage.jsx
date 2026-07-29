import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import Navbar from './Navbar';
import { supabase } from '../lib/supabaseClient';
import { trackLead } from '../lib/pixel';

const PACKAGES = [
  {
    id: '60min',
    name: '60 Minute Session',
    description: 'A safe first conversation to explore what you are carrying and whether we are the right fit.',
    price: 'PKR 10,000',
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
    price: 'PKR 25,000',
    originalPrice: 'PKR 30,000',
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
    price: 'PKR 14,500',
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
    price: 'PKR 45,000',
    originalPrice: 'PKR 50,000',
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
    price: 'PKR 25,000',
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
    id: 'quran-life-batch-02',
    name: 'Quran & Life Batch 02 (Course)',
    description: 'Full enrollment for Quran & Life Batch 02 live cohort course by Abdul Rehman Cheema.',
    price: 'PKR 5,000',
    duration: 'Live Cohort Course',
    isPopular: false,
    recommended: false,
    features: [
      'Live interactive cohort sessions',
      'Recorded lectures provided after every class',
      'Comprehensive PDF study notes & reading material',
      'Direct Q&A with Abdul Rehman Cheema',
      'Community access & continuous support',
    ],
  },
];

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', time: '9:00 AM - 12:00 PM' },
  { id: 'afternoon', label: 'Afternoon', time: '12:00 PM - 5:00 PM' },
  { id: 'evening', label: 'Evening', time: '5:00 PM - 9:00 PM' },
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
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('');
  const [matter, setMatter] = useState('');

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
      newErrors.package = 'Please select a package first.';
    }

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!email.trim() && !phone.trim()) {
      newErrors.contact = 'Either Email or Phone must be provided.';
    } else {
      if (email.trim() && !/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
      if (phone.trim() && !/^\+?[0-9\s-]{7,15}$/.test(phone)) {
        newErrors.phone = 'Please enter a valid phone number.';
      }
    }

    if (!preferredDate) {
      newErrors.preferredDate = 'Please select a preferred date.';
    } else {
      const selectedDate = new Date(preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.preferredDate = 'Date cannot be in the past.';
      }
    }

    if (!preferredTimeSlot) {
      newErrors.preferredTimeSlot = 'Please select a preferred time slot.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        scrollToForm();
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // 1. Prepare the payload for bookings insert
      const bookingPayload = {
        package_id: selectedPackage.id,
        package_name: selectedPackage.name,
        price: selectedPackage.price,
        full_name: fullName,
        email: email || null,
        phone: phone || null,
        preferred_date: preferredDate,
        preferred_time_slot: preferredTimeSlot,
        matter: matter || null,
        receipt_path: null
      };

      // 2. Insert into public.bookings (no .select() — anon has INSERT-only privilege)
      const { error: insertError } = await supabase
        .from('bookings')
        .insert([bookingPayload]);

      if (insertError) {
        throw new Error(`Booking submission failed: ${insertError.message}`);
      }

      // LOG THE PAYLOAD TO CONSOLE
      console.log('--- ARC BOOKING SUBMISSION PAYLOAD ---');
      console.log(JSON.stringify(bookingPayload, null, 2));
      console.log('--------------------------------------');

      // Trigger Meta Pixel Lead Event
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: selectedPackage.name,
          value: selectedPackage.price,
          currency: 'PKR'
        });
      } else {
        trackLead({
          content_name: selectedPackage.name,
          value: selectedPackage.price,
          currency: 'PKR'
        });
      }

      // Build display data from local form state (no server row read-back)
      setSubmittedData({
        packageName: selectedPackage.name,
        fullName,
        preferredDate,
        preferredTimeSlot,
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
    <div className="min-h-screen pt-24 pb-20 bg-[var(--neu-base)] text-[var(--neu-text)] transition-colors duration-300">
      <Navbar />
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 mb-8 text-sm font-semibold transition-colors duration-300 text-[var(--neu-text-muted)] hover:text-[var(--neu-accent)] cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center py-16 px-8 rounded-2xl bg-[var(--neu-card-bg)] border border-[var(--neu-accent)] shadow-[0_0_30px_rgba(240,168,56,0.15)]"
          >
            <CheckCircle className="w-16 h-16 mx-auto mb-6 text-[var(--neu-accent)]" />
            <h2 className="text-3xl font-bold mb-4 font-heading text-[var(--neu-text)]">
              Booking Request Received!
            </h2>
            <p className="text-[var(--neu-text-muted)] leading-relaxed mb-6">
              Thank you, <span className="font-bold text-[var(--neu-text)]">{submittedData?.fullName}</span>.
              We have logged your request for the <span className="font-semibold text-[var(--neu-accent)]">{submittedData?.packageName}</span>.
              We'll review your preferred slot ({submittedData?.preferredDate} - {submittedData?.preferredTimeSlot}) and get in touch with you shortly to confirm your booking.
            </p>
            <button
              onClick={() => navigate('/')}
              className="neu-btn px-6 py-2.5 text-sm cursor-pointer"
            >
              Return Home
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-12">

            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--neu-text)]">
                Book Your{' '}
                <span className="font-display text-[var(--neu-accent)] tracking-wider">
                  Session
                </span>
              </h1>
              <p className="text-[var(--neu-text-muted)] max-w-xl mx-auto">
                Follow our <span className="text-[var(--neu-accent)] font-bold">simple two-step process</span> to reserve your counselling slot.
              </p>
            </div>

            {/* Supabase Error Banner */}
            {submitError && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-[var(--neu-text)] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[var(--neu-accent)] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-[var(--neu-accent)]">Submission Error:</strong>
                  <p className="text-xs text-[var(--neu-text-muted)] mt-1">{submitError}</p>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {Object.keys(errors).length > 0 && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-[var(--neu-text)] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[var(--neu-accent)] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-[var(--neu-accent)]">Please correct the following errors:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-xs text-[var(--neu-text-muted)]">
                    {Object.values(errors).map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* STEP 1: PACKAGE SELECTION */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-[var(--neu-border)] pb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs bg-[var(--neu-accent)] text-[var(--neu-base)]">1</span>
                <h2 className="text-xl font-bold tracking-wide">Select Your Counselling Package</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PACKAGES.map((pkg, idx) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  return (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.07 }}
                      className={`relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden ${isSelected
                        ? 'border-[var(--neu-accent)] shadow-[0_0_28px_rgba(240,168,56,0.22)] scale-[1.02]'
                        : 'border-[var(--neu-border)] hover:border-[var(--neu-accent)]/60'
                        } bg-[var(--neu-card-bg)]`}
                    >
                      {/* Badge row */}
                      {(pkg.isPopular || pkg.recommended) && (
                        <div className="px-5 pt-4">
                          <span className="inline-block text-[0.6rem] font-black tracking-widest uppercase px-2.5 py-1 rounded-full bg-[var(--neu-accent)] text-[var(--neu-base)]">
                            {pkg.isPopular ? '⭐ Most Popular' : '✦ Recommended By ARC'}
                          </span>
                        </div>
                      )}

                      {/* Card body */}
                      <div className="flex flex-col flex-1 p-5 pt-4 space-y-3">

                        {/* Name */}
                        <h3 className="text-lg font-bold text-[var(--neu-accent)] leading-tight">
                          {pkg.name}
                        </h3>

                        {/* Price row */}
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-3xl font-extrabold text-[var(--neu-text)] tracking-tight">
                            {pkg.price}
                          </span>
                          {pkg.originalPrice && (
                            <span className="text-xs line-through text-[var(--neu-text-faint)]">
                              {pkg.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Duration chip */}
                        <span className="text-[11px] text-[var(--neu-text-muted)] font-medium">
                          {pkg.duration}
                        </span>

                        {/* Save badge */}
                        {pkg.originalPrice && (() => {
                          const orig = parseInt(pkg.originalPrice.replace(/[^0-9]/g, ''), 10);
                          const curr = parseInt(pkg.price.replace(/[^0-9]/g, ''), 10);
                          const saved = orig - curr;
                          return (
                            <span className="w-max text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--neu-accent)]/15 text-[var(--neu-accent)] border border-[var(--neu-accent)]/30">
                              Save PKR {saved.toLocaleString()}
                            </span>
                          );
                        })()}

                        {/* Description */}
                        <p className="text-xs text-[var(--neu-text-muted)] leading-relaxed">
                          {pkg.description}
                        </p>

                        {/* Divider */}
                        <div className="border-t border-[var(--neu-border)] pt-3">
                          {/* Feature list */}
                          <ul className="space-y-2">
                            {pkg.features.map((f) => (
                              <li key={f} className="flex items-start gap-2 text-xs text-[var(--neu-text-muted)]">
                                <span className="mt-0.5 text-[var(--neu-accent)] flex-shrink-0">✓</span>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Select Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setErrors(prev => {
                              const copy = { ...prev };
                              delete copy.package;
                              return copy;
                            });
                            setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                          }}
                          className={`mt-auto w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 border cursor-pointer ${isSelected
                            ? 'bg-[var(--neu-accent)] text-[var(--neu-base)] border-[var(--neu-accent)] shadow-md'
                            : 'bg-transparent text-[var(--neu-text)] border-[var(--neu-border)] hover:border-[var(--neu-accent)] hover:text-[var(--neu-accent)]'
                            }`}
                        >
                          {isSelected ? '✓ Selected' : 'Select Package'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {errors.package && (
                <p className="text-xs text-amber-500/90 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.package}
                </p>
              )}
            </div>

            {/* STEP 2: CLIENT DETAILS */}
            <div ref={formRef} className="space-y-6 pt-6">
              <div className="flex items-center gap-3 border-b border-[var(--neu-border)] pb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs bg-[var(--neu-accent)] text-[var(--neu-base)]">2</span>
                <h2 className="text-xl font-bold tracking-wide">Your Details & Preferences</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-[var(--neu-text-muted)] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[var(--neu-accent)]" /> Full Name <span className="text-[var(--neu-accent)]">*</span>
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
                    placeholder="e.g. Haris Mahar"
                    className="w-full px-4 py-3 rounded-lg bg-[var(--neu-card-bg)] border border-[var(--neu-border)] text-sm text-[var(--neu-text)] focus:outline-none focus:border-[var(--neu-border-solid)] focus:ring-1 focus:ring-[var(--neu-accent)] transition-all"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-amber-500/90 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Preferred Date */}
                <div className="space-y-2">
                  <label htmlFor="preferredDate" className="text-xs font-bold uppercase tracking-wider text-[var(--neu-text-muted)] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--neu-accent)]" /> Preferred Date <span className="text-[var(--neu-accent)]">*</span>
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    value={preferredDate}
                    onChange={(e) => {
                      setPreferredDate(e.target.value);
                      if (e.target.value) {
                        setErrors(prev => {
                          const copy = { ...prev };
                          delete copy.preferredDate;
                          return copy;
                        });
                      }
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--neu-card-bg)] border border-[var(--neu-border)] text-sm text-[var(--neu-text)] focus:outline-none focus:border-[var(--neu-border-solid)] focus:ring-1 focus:ring-[var(--neu-accent)] transition-all"
                  />
                  {errors.preferredDate && (
                    <p className="text-xs text-amber-500/90 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.preferredDate}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[var(--neu-text-muted)] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[var(--neu-accent)]" /> Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (e.target.value || phone) {
                        setErrors(prev => {
                          const copy = { ...prev };
                          delete copy.contact;
                          delete copy.email;
                          return copy;
                        });
                      }
                    }}
                    placeholder="e.g. haris@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-[var(--neu-card-bg)] border border-[var(--neu-border)] text-sm text-[var(--neu-text)] focus:outline-none focus:border-[var(--neu-border-solid)] focus:ring-1 focus:ring-[var(--neu-accent)] transition-all"
                  />
                  {errors.email && (
                    <p className="text-xs text-amber-500/90 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-[var(--neu-text-muted)] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[var(--neu-accent)]" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (e.target.value || email) {
                        setErrors(prev => {
                          const copy = { ...prev };
                          delete copy.contact;
                          delete copy.phone;
                          return copy;
                        });
                      }
                    }}
                    placeholder="e.g. +92 300 1234567"
                    className="w-full px-4 py-3 rounded-lg bg-[var(--neu-card-bg)] border border-[var(--neu-border)] text-sm text-[var(--neu-text)] focus:outline-none focus:border-[var(--neu-border-solid)] focus:ring-1 focus:ring-[var(--neu-accent)] transition-all"
                  />
                  {errors.phone && (
                    <p className="text-xs text-amber-500/90 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>

                {/* Contact helper message */}
                <div className="md:col-span-2">
                  {errors.contact && (
                    <p className="text-xs text-amber-500/90 flex items-center gap-1 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-[var(--neu-accent)]" /> {errors.contact}
                    </p>
                  )}
                  {!errors.contact && (
                    <p className="text-[10px] text-[var(--neu-text-faint)] mt-1">
                      Note: You must provide at least one contact method (Email or Phone) so we can send details.
                    </p>
                  )}
                </div>

                {/* Briefly Explain Your Matter */}
                <div className="md:col-span-2 space-y-2">
                  <label htmlFor="matter" className="text-xs font-bold uppercase tracking-wider text-[var(--neu-text-muted)] flex items-center gap-1.5">
                    <span className="text-[var(--neu-accent)] text-sm">✦</span> Briefly Explain Your Matter
                  </label>
                  <textarea
                    id="matter"
                    value={matter}
                    onChange={(e) => setMatter(e.target.value)}
                    rows={4}
                    placeholder="Briefly describe what you'd like to discuss or work through in your session…"
                    className="w-full px-4 py-3 rounded-lg bg-[var(--neu-card-bg)] border border-[var(--neu-border)] text-sm text-[var(--neu-text)] focus:outline-none focus:border-[var(--neu-border-solid)] focus:ring-1 focus:ring-[var(--neu-accent)] transition-all resize-none placeholder:text-[var(--neu-text-faint)] leading-relaxed"
                  />
                  <p className="text-[10px] text-[var(--neu-text-faint)]">
                    Optional — everything you share is strictly confidential.
                  </p>
                </div>

                {/* Time Slots */}
                <div className="md:col-span-2 space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--neu-text-muted)] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[var(--neu-accent)]" /> Preferred Time Slot <span className="text-[var(--neu-accent)]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = preferredTimeSlot === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => {
                            setPreferredTimeSlot(slot.id);
                            setErrors(prev => {
                              const copy = { ...prev };
                              delete copy.preferredTimeSlot;
                              return copy;
                            });
                          }}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer ${isSelected
                            ? 'bg-[var(--neu-accent)] border-[var(--neu-accent)] text-[var(--neu-base)] shadow-[0_4px_12px_rgba(184,121,31,0.2)]'
                            : 'bg-[var(--neu-card-bg)] border-[var(--neu-border)] text-[var(--neu-text)] hover:border-[var(--neu-accent)]'
                            }`}
                        >
                          <span className="text-sm font-bold">{slot.label}</span>
                          <span className={`text-[10px] mt-1 ${isSelected ? 'text-[var(--neu-base)] opacity-80' : 'text-[var(--neu-text-muted)]'}`}>
                            {slot.time}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.preferredTimeSlot && (
                    <p className="text-xs text-amber-500/90 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.preferredTimeSlot}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-6 text-center space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-12 py-4 rounded-xl text-base font-extrabold cursor-pointer transition-all duration-300 neu-btn-primary disabled:opacity-50 disabled:cursor-not-allowed border-none"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Booking Request'}
              </button>

              <p className="text-[10px] text-[var(--neu-text-faint)] max-w-sm mx-auto leading-normal">
                By completing booking, you agree to our 24-hour cancellation policy.
              </p>
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
            className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--neu-card-bg)] border-t border-[var(--neu-border)] py-4 px-6 md:px-12 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] flex flex-row items-center justify-between gap-4"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-[var(--neu-accent)] tracking-wider block">Selected Package</span>
              <strong className="text-sm md:text-base font-bold text-[var(--neu-text)]">{selectedPackage.name}</strong>
              <span className="text-xs md:text-sm text-[var(--neu-text-muted)] ml-2">( {selectedPackage.price} )</span>
            </div>

            <button
              onClick={scrollToForm}
              className="px-5 py-2.5 rounded-lg text-xs font-bold bg-[var(--neu-accent)] hover:bg-[var(--neu-accent-hover)] text-[var(--neu-base)] transition-colors cursor-pointer shadow-md border-none"
            >
              Submit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

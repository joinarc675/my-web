import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Calendar,
  GraduationCap,
  MapPin,
  FileText,
  CreditCard,
  Landmark,
  Wallet,
  UploadCloud,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Copy,
  FileEdit,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { trackLead } from '../lib/pixel';

export default function CareerApplicationModal({
  isOpen,
  onClose,
  selectedPlan = {
    name: 'Career Mentorship Program',
    duration: '03 Months',
    fee: 'PKR 10,000/-',
    originalFee: 'PKR 50,000/-',
    id: 'mentorship',
  },
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <CareerApplicationModalDialog
      onClose={onClose}
      selectedPlan={selectedPlan}
    />
  );
}

function CareerApplicationModalDialog({ onClose, selectedPlan }) {
  const [step, setStep] = useState(1); // 1 = Form, 2 = Payment Options, 3 = Success
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    qualification: '',
    city: '',
    briefProblem: '',
    whatsappNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [uploadedReceiptUrl, setUploadedReceiptUrl] = useState('');
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.age.trim()) newErrors.age = 'Age is required';
    if (!formData.qualification.trim())
      newErrors.qualification = 'Qualification is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.briefProblem.trim())
      newErrors.briefProblem = 'Please describe your problem briefly';
    if (!formData.whatsappNumber.trim())
      newErrors.whatsappNumber = 'WhatsApp number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // 1. Prepare payload with exact columns existing in bookings table
      const bookingPayload = {
        package_id: selectedPlan.id || 'career-mentorship',
        package_name: selectedPlan.name || 'Career Mentorship Program',
        name: formData.name.trim(),
        email: null,
        age: formData.age ? parseInt(formData.age, 10) : null,
        city: formData.city.trim() || null,
        profession: formData.qualification.trim() || null,
        whatsapp_number: formData.whatsappNumber.trim(),
        brief_problem: formData.briefProblem.trim() || null,
      };

      if (supabase && supabase.from) {
        // Plain insert without .select('id') to avoid anon RLS SELECT restrictions
        const { error: insertError } = await supabase
          .from('bookings')
          .insert([bookingPayload]);

        if (insertError) {
          console.error('Bookings insert error:', insertError);
        } else {
          console.log('--- CAREER BOOKING SAVED IN SUPABASE ---');
          console.log(bookingPayload);
        }
      }
    } catch (err) {
      console.error('Booking submission exception:', err);
    }

    try {
      trackLead();
    } catch (err) {
      console.warn('Pixel tracking notice:', err);
    }

    setIsSubmitting(false);
    setStep(2); // Advance to Payment Screen (Image 2)
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2500);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFile(file);
    setUploadError('');
    setIsUploadingReceipt(true);

    try {
      const ext = file.name.split('.').pop() || 'png';
      const timestamp = Date.now();
      const cleanName = formData.name.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'applicant';
      const fileName = `${timestamp}_${cleanName}.${ext}`;

      let receiptPublicUrl = '';

      if (supabase && supabase.storage) {
        // 1. Upload receipt to user's "payment-receipts" storage bucket (upsert: false avoids RLS UPDATE policy violation)
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('payment-receipts')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || undefined,
          });

        if (uploadErr) {
          console.error('Payment receipt storage upload error:', uploadErr);
          setUploadError(`Storage upload error: ${uploadErr.message}. You can send your receipt via WhatsApp below.`);
          setIsUploadingReceipt(false);
          return;
        }

        console.log('Receipt uploaded to payment-receipts:', uploadData);

        // 2. Obtain the public URL
        const { data: urlData } = supabase.storage
          .from('payment-receipts')
          .getPublicUrl(fileName);

        receiptPublicUrl = urlData?.publicUrl || '';
        setUploadedReceiptUrl(receiptPublicUrl);
        console.log('Receipt Public URL:', receiptPublicUrl);

        // 3. Ensure receipt is recorded in the bookings table
        const receiptNote = receiptPublicUrl
          ? `[Payment Receipt: ${receiptPublicUrl}]`
          : `[Payment Receipt File: ${fileName}]`;

        const updatedProblem = formData.briefProblem.trim()
          ? `${formData.briefProblem.trim()}\n\n${receiptNote}`
          : receiptNote;

        // Try to update existing booking by WhatsApp number and name
        const { error: updateErr } = await supabase
          .from('bookings')
          .update({
            brief_problem: updatedProblem,
          })
          .eq('whatsapp_number', formData.whatsappNumber.trim())
          .eq('name', formData.name.trim());

        // If RLS prevents update or no row matched, insert the completed payment record
        if (updateErr) {
          console.log('Update not allowed by RLS, inserting receipt booking record...');
          const receiptPayload = {
            package_id: selectedPlan.id || 'career-mentorship',
            package_name: `${selectedPlan.name || 'Career Mentorship Program'} (Receipt Uploaded)`,
            name: formData.name.trim(),
            email: null,
            age: formData.age ? parseInt(formData.age, 10) : null,
            city: formData.city.trim() || null,
            profession: formData.qualification.trim() || null,
            whatsapp_number: formData.whatsappNumber.trim(),
            brief_problem: updatedProblem,
          };

          const { error: insErr } = await supabase
            .from('bookings')
            .insert([receiptPayload]);

          if (insErr) {
            console.error('Receipt booking insert error:', insErr);
          } else {
            console.log('Receipt booking successfully saved to bookings table');
          }
        } else {
          console.log('Booking successfully updated with receipt URL in bookings table');
        }

        // 4. If a receipt_url column exists in bookings table, also try updating it
        if (receiptPublicUrl) {
          try {
            await supabase
              .from('bookings')
              .update({ receipt_url: receiptPublicUrl })
              .eq('whatsapp_number', formData.whatsappNumber.trim());
          } catch {
            // Silently ignore if column does not exist
          }
        }
      }

      // 5. Advance to Step 3: Professional Success Popup
      setStep(3);
    } catch (err) {
      console.error('Receipt handling exception:', err);
      setUploadError('An unexpected error occurred while saving the receipt. Please send via WhatsApp.');
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const getWhatsAppReceiptUrl = (directReceiptUrl = '') => {
    const finalUrl = directReceiptUrl || uploadedReceiptUrl;
    let msg = `Hello ARC, I have submitted my application for the ${selectedPlan.name} (Fee: ${selectedPlan.fee}).\n\nName: ${formData.name}\nWhatsApp: ${formData.whatsappNumber}\nCity: ${formData.city}\n\nI have completed the payment and submitted my receipt.`;
    if (finalUrl) {
      msg += `\n\nReceipt Link: ${finalUrl}`;
    }
    return `https://wa.me/923458612538?text=${encodeURIComponent(msg)}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto no-scrollbar bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`relative w-full rounded-2xl sm:rounded-3xl border border-[#E8C477]/45 bg-[#0A0A0A] text-[#F7F7F4] shadow-2xl my-auto overflow-y-auto no-scrollbar ${step === 1 ? 'max-w-md sm:max-w-lg p-4 sm:p-6' : 'max-w-4xl p-4 sm:p-6'
            }`}
          style={{ maxHeight: '94vh', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Top Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-1.5 sm:p-2 rounded-full bg-white/10 text-stone-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer border-none"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* ============================================================
              STEP 1: APPLICATION FORM (Image 1)
              ============================================================ */}
          {step === 1 && (
            <div>
              {/* Form Header */}
              <div className="text-center mb-3 sm:mb-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#E8C477] bg-[#E8C477]/10 flex items-center justify-center text-[#E8C477] mx-auto mb-2 shadow-[0_0_15px_rgba(232,196,119,0.25)]">
                  <FileEdit className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F7F4] font-sans">
                  Application Form
                </h3>
                <p className="text-[11px] sm:text-xs text-[#D9DDD7] mt-0.5 max-w-sm mx-auto">
                  Please fill in the details below to proceed with your application.
                </p>
                <div className="w-12 h-0.5 bg-[#E8C477] rounded-full mx-auto mt-2" />
              </div>

              {/* Form */}
              <form onSubmit={handleProceedToPayment} className="space-y-2 sm:space-y-2.5">
                {/* Field 1: Name */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#F7F7F4] mb-0.5 sm:mb-1">
                    <User className="w-3.5 h-3.5 text-[#E8C477]" />
                    <span>Name *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#141414] border text-xs sm:text-sm text-[#F7F7F4] placeholder:text-stone-500 outline-none transition-all ${errors.name
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-stone-800 focus:border-[#E8C477] focus:ring-1 focus:ring-[#E8C477]'
                      }`}
                  />
                  {errors.name && (
                    <span className="text-[11px] text-red-400 mt-0.5 block">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Field 2: Age */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#F7F7F4] mb-0.5 sm:mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#E8C477]" />
                    <span>Age *</span>
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="Enter your age"
                    min="10"
                    max="100"
                    className={`w-full px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#141414] border text-xs sm:text-sm text-[#F7F7F4] placeholder:text-stone-500 outline-none transition-all ${errors.age
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-stone-800 focus:border-[#E8C477] focus:ring-1 focus:ring-[#E8C477]'
                      }`}
                  />
                  {errors.age && (
                    <span className="text-[11px] text-red-400 mt-0.5 block">
                      {errors.age}
                    </span>
                  )}
                </div>

                {/* Field 3: Qualification */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#F7F7F4] mb-0.5 sm:mb-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#E8C477]" />
                    <span>Qualification *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => handleChange('qualification', e.target.value)}
                    placeholder="Enter your qualification"
                    className={`w-full px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#141414] border text-xs sm:text-sm text-[#F7F7F4] placeholder:text-stone-500 outline-none transition-all ${errors.qualification
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-stone-800 focus:border-[#E8C477] focus:ring-1 focus:ring-[#E8C477]'
                      }`}
                  />
                  {errors.qualification && (
                    <span className="text-[11px] text-red-400 mt-0.5 block">
                      {errors.qualification}
                    </span>
                  )}
                </div>

                {/* Field 4: City */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#F7F7F4] mb-0.5 sm:mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E8C477]" />
                    <span>City *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Enter your city"
                    className={`w-full px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#141414] border text-xs sm:text-sm text-[#F7F7F4] placeholder:text-stone-500 outline-none transition-all ${errors.city
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-stone-800 focus:border-[#E8C477] focus:ring-1 focus:ring-[#E8C477]'
                      }`}
                  />
                  {errors.city && (
                    <span className="text-[11px] text-red-400 mt-0.5 block">
                      {errors.city}
                    </span>
                  )}
                </div>

                {/* Field 5: Brief Problem */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#F7F7F4] mb-0.5 sm:mb-1">
                    <FileText className="w-3.5 h-3.5 text-[#E8C477]" />
                    <span>Brief Problem *</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.briefProblem}
                    onChange={(e) => handleChange('briefProblem', e.target.value)}
                    placeholder="Tell us briefly about your problem"
                    className={`w-full px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#141414] border text-xs sm:text-sm text-[#F7F7F4] placeholder:text-stone-500 outline-none transition-all resize-none ${errors.briefProblem
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-stone-800 focus:border-[#E8C477] focus:ring-1 focus:ring-[#E8C477]'
                      }`}
                  />
                  {errors.briefProblem && (
                    <span className="text-[11px] text-red-400 mt-0.5 block">
                      {errors.briefProblem}
                    </span>
                  )}
                </div>

                {/* Field 6: WhatsApp Number */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#F7F7F4] mb-0.5 sm:mb-1">
                    <MessageCircle className="w-3.5 h-3.5 text-[#E8C477]" />
                    <span>WhatsApp Number *</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                    placeholder="Enter your WhatsApp number (e.g. 0345 861 2538)"
                    className={`w-full px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#141414] border text-xs sm:text-sm text-[#F7F7F4] placeholder:text-stone-500 outline-none transition-all ${errors.whatsappNumber
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-stone-800 focus:border-[#E8C477] focus:ring-1 focus:ring-[#E8C477]'
                      }`}
                  />
                  {errors.whatsappNumber && (
                    <span className="text-[11px] text-red-400 mt-0.5 block">
                      {errors.whatsappNumber}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2 sm:pt-2.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#E8C477] hover:bg-[#dfb763] text-[#0A0A0A] font-bold py-2.5 sm:py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-[#E8C477]/30 cursor-pointer text-xs sm:text-sm border-none disabled:opacity-60"
                  >
                    <span>{isSubmitting ? 'Processing...' : 'Proceed to Payment'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================
              STEP 2: PAYMENT OPTIONS & PROGRAM FEE (Image 2)
              ============================================================ */}
          {step === 2 && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
                {/* LEFT COLUMN: Payment Options */}
                <div className="lg:col-span-6 rounded-2xl border border-[#E8C477]/40 bg-[#0E0E0E] p-4 sm:p-5 flex flex-col justify-between shadow-xl no-scrollbar">
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                      <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-[#E8C477] bg-[#E8C477]/10 flex items-center justify-center text-[#E8C477] flex-shrink-0 shadow-[0_0_15px_rgba(232,196,119,0.25)]">
                        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#F7F7F4] leading-tight">
                          Payment Options
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#D9DDD7] mt-0.5">
                          Select your preferred payment method and complete your payment securely.
                        </p>
                      </div>
                    </div>

                    {/* Method 01: EasyPaisa */}
                    <div className="p-3 sm:p-3.5 rounded-xl border border-stone-800 bg-[#141414] mb-2 sm:mb-2.5 hover:border-[#E8C477]/50 transition-all flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E8C477]/20 border border-[#E8C477]/60 text-[#E8C477] text-[11px] sm:text-xs font-bold flex items-center justify-center flex-shrink-0">
                          01
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-[#E8C477] flex-shrink-0">
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#F7F7F4]">
                            EasyPaisa
                          </h4>
                          <p className="text-[11px] text-[#D9DDD7] font-mono">
                            0345 881 2538 by name
                          </p>
                          <p className="text-[11px] text-[#E8C477] font-semibold">
                            Abdul Rehman Cheema
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('03458812538', 'easypaisa')}
                        className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-[#E8C477] text-[11px] font-semibold flex items-center gap-1 border-none cursor-pointer transition-colors"
                      >
                        {copiedKey === 'easypaisa' ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Method 02: JazzCash */}
                    <div className="p-3 sm:p-3.5 rounded-xl border border-stone-800 bg-[#141414] mb-2 sm:mb-2.5 hover:border-[#E8C477]/50 transition-all flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E8C477]/20 border border-[#E8C477]/60 text-[#E8C477] text-[11px] sm:text-xs font-bold flex items-center justify-center flex-shrink-0">
                          02
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-[#E8C477] flex-shrink-0">
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#F7F7F4]">
                            JazzCash
                          </h4>
                          <p className="text-[11px] text-[#D9DDD7] font-mono">
                            0345 881 2538 by name
                          </p>
                          <p className="text-[11px] text-[#E8C477] font-semibold">
                            Abdul Rehman Cheema
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('03458812538', 'jazzcash')}
                        className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-[#E8C477] text-[11px] font-semibold flex items-center gap-1 border-none cursor-pointer transition-colors"
                      >
                        {copiedKey === 'jazzcash' ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Method 03: Bank Details */}
                    <div className="p-3 sm:p-3.5 rounded-xl border border-stone-800 bg-[#141414] mb-3 hover:border-[#E8C477]/50 transition-all flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E8C477]/20 border border-[#E8C477]/60 text-[#E8C477] text-[11px] sm:text-xs font-bold flex items-center justify-center flex-shrink-0">
                          03
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-[#E8C477] flex-shrink-0">
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#F7F7F4]">
                            Bank Details
                          </h4>
                          <p className="text-[11px] text-[#D9DDD7]">
                            Lucky Bank Limited
                          </p>
                          <p className="text-[11px] font-mono text-[#E8C477] font-bold">
                            Account: 1643 38925
                          </p>
                          <p className="text-[10px] text-stone-400">
                            United Bank Limited
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('164338925', 'bank')}
                        className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-[#E8C477] text-[11px] font-semibold flex items-center gap-1 border-none cursor-pointer transition-colors"
                      >
                        {copiedKey === 'bank' ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Upload Receipt Card / WhatsApp Confirmation */}
                  <div className="mt-2 pt-3 border-t border-stone-800">
                    <label
                      htmlFor="receipt-upload"
                      className={`group p-3 rounded-xl text-[#0A0A0A] flex items-center justify-between cursor-pointer transition-all ${
                        isUploadingReceipt
                          ? 'bg-[#E8C477]/60 cursor-wait'
                          : 'bg-gradient-to-r from-[#E8C477] to-[#dfb763] hover:shadow-[0_4px_16px_rgba(232,196,119,0.3)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-black/15 flex items-center justify-center text-[#0A0A0A]">
                          {isUploadingReceipt ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <UploadCloud className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold leading-tight">
                            {isUploadingReceipt
                              ? 'Uploading Receipt…'
                              : receiptFile
                              ? receiptFile.name
                              : 'Upload Receipt'}
                          </h4>
                          <p className="text-[10px] sm:text-[11px] font-medium opacity-85">
                            {isUploadingReceipt
                              ? 'Please wait while we save your receipt.'
                              : receiptFile
                              ? 'File selected! Click to change'
                              : 'After payment, please upload your receipt.'}
                          </p>
                        </div>
                      </div>
                      {!isUploadingReceipt && (
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      )}
                      <input
                        id="receipt-upload"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        disabled={isUploadingReceipt}
                        className="hidden"
                      />
                    </label>

                    {uploadError && (
                      <p className="text-[11px] text-red-400 mt-1.5 text-center">{uploadError}</p>
                    )}

                    {/* WhatsApp backup button */}
                    <a
                      href={getWhatsAppReceiptUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all no-underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Send Screenshot on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* RIGHT COLUMN: Program Fee & Process (Faithful Ivory Card from Mockup) */}
                <div className="lg:col-span-6 rounded-2xl border border-[#EAE4D9] bg-[#FAF7F2] text-[#111111] p-4 sm:p-5 flex flex-col justify-between shadow-xl no-scrollbar">
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                      <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#111111] flex items-center justify-center text-white flex-shrink-0 shadow-md">
                        <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-[#E8C477]" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#111111] leading-tight">
                          Program Fee
                        </h3>
                        <p className="text-[11px] sm:text-xs text-stone-600 mt-0.5">
                          Invest in your growth and future.
                        </p>
                      </div>
                    </div>

                    {/* Details Rows */}
                    <div className="space-y-2.5 mb-4 text-xs sm:text-sm">
                      <div className="flex items-center justify-between py-1.5 border-b border-[#EAE4D9]">
                        <span className="text-stone-600 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-stone-700" />
                          <span>Program Name</span>
                        </span>
                        <span className="font-bold text-[#111111] text-right">
                          {selectedPlan.name}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-[#EAE4D9]">
                        <span className="text-stone-600 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-700" />
                          <span>Duration</span>
                        </span>
                        <span className="font-bold text-[#111111]">
                          {selectedPlan.duration}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-[#EAE4D9]">
                        <span className="text-stone-600 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-stone-700" />
                          <span>Total Fee</span>
                        </span>
                        <span className="text-base sm:text-lg font-extrabold text-[#111111]">
                          {selectedPlan.fee}
                        </span>
                      </div>
                    </div>

                    {/* Early Bird Offer Callout */}
                    <div className="p-3 rounded-xl bg-[#FCECC9] border border-[#E9C874] mb-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-[#9C7938] flex-shrink-0" />
                        <div>
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                            Early Bird Offer
                          </h5>
                          <p className="text-[10px] text-stone-600">
                            Limited Time Only
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-stone-500 line-through block">
                          {selectedPlan.originalFee || 'PKR 50,000/-'}
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-[#111111]">
                          {selectedPlan.fee}
                        </span>
                      </div>
                    </div>

                    {/* Payment Process (Numbered 1 to 4) */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-2">
                        Payment Process
                      </h4>
                      <ol className="space-y-1.5 text-[11px] text-stone-700">
                        <li className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#9C7938] text-white font-bold text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                            1
                          </span>
                          <span>Make the payment via EasyPaisa, JazzCash or Bank Transfer.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#9C7938] text-white font-bold text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                            2
                          </span>
                          <span>Keep your transaction screenshot / receipt.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#9C7938] text-white font-bold text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                            3
                          </span>
                          <span>Upload the receipt using the button on the left.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#9C7938] text-white font-bold text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                            4
                          </span>
                          <span>You&apos;ll receive a confirmation shortly.</span>
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-[#EAE4D9] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:text-black bg-[#EFE9DF] hover:bg-[#E5DFD3] flex items-center gap-1.5 transition-colors border-none cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Edit Info</span>
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="bg-[#111111] hover:bg-black text-[#E8C477] hover:text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer shadow-md"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 3: RECEIPT SUBMITTED — SUCCESS CONFIRMATION
              ============================================================ */}
          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center text-center py-6 sm:py-8 px-2"
            >
              {/* Animated Check Ring */}
              <div className="relative mb-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E8C477]/10 border-2 border-[#E8C477] flex items-center justify-center shadow-[0_0_40px_rgba(232,196,119,0.25)]">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#E8C477]" strokeWidth={1.5} />
                </div>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0A0A0A] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-[#F7F7F4] mb-1.5">
                Receipt Submitted!
              </h3>
              <div className="w-12 h-0.5 bg-[#E8C477] rounded-full mx-auto mb-4" />

              {/* Body message */}
              <p className="text-sm sm:text-base text-[#D9DDD7] leading-relaxed max-w-sm mb-2">
                Thank you, <span className="text-[#E8C477] font-semibold">{formData.name || 'Applicant'}</span>.
                Your payment receipt has been received successfully.
              </p>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm mb-6">
                Our team will verify your payment and reach out to you on WhatsApp at{' '}
                <span className="text-[#E8C477] font-semibold font-mono">{formData.whatsappNumber}</span>{' '}
                shortly to confirm your enrollment.
              </p>

              {/* Info card */}
              <div className="w-full max-w-xs bg-[#141414] border border-[#E8C477]/25 rounded-xl p-4 mb-6 text-left space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E8C477]" />
                    Program
                  </span>
                  <span className="font-semibold text-[#F7F7F4]">{selectedPlan.name}</span>
                </div>
                <div className="flex items-center justify-between border-t border-stone-800 pt-2">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#E8C477]" />
                    Fee
                  </span>
                  <span className="font-bold text-[#E8C477]">{selectedPlan.fee}</span>
                </div>
                <div className="flex items-center justify-between border-t border-stone-800 pt-2">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-[#E8C477]" />
                    WhatsApp
                  </span>
                  <span className="font-semibold text-[#F7F7F4] font-mono">{formData.whatsappNumber}</span>
                </div>
                {uploadedReceiptUrl && (
                  <div className="flex items-center justify-between border-t border-stone-800 pt-2">
                    <span className="text-stone-500 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Receipt
                    </span>
                    <span className="font-semibold text-emerald-400 text-[11px]">Saved in Storage</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <a
                  href={getWhatsAppReceiptUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition-all no-underline"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-[#E8C477] hover:bg-[#dfb763] text-[#0A0A0A] text-xs font-bold transition-all border-none cursor-pointer shadow-md"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

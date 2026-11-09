'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Phone, MessageSquare, CheckCircle2, ShieldCheck, ArrowRight, Clock } from 'lucide-react';

export default function TimedCtaPopup() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Off-Plan Early Access');

  useEffect(() => {
    // Reset submission state on new page
    setIsSubmitted(false);

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem(`cta_dismissed_${pathname}`);
    if (isDismissed) return;

    // 1-minute timer (60,000 milliseconds)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 60000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleClose = () => {
    setIsVisible(false);
    // Mark as dismissed for this route in current session
    sessionStorage.setItem(`cta_dismissed_${pathname}`, 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Auto-close after 3 seconds
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem(`cta_dismissed_${pathname}`, 'true');
    }, 3500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#111812] border border-white/15 text-white rounded-3xl overflow-hidden shadow-2xl z-10 my-auto"
          >
            {/* Top Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left Column / Image Banner */}
              <div className="relative md:col-span-5 hidden md:block overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                  alt="Dubai Luxury Penthouse"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111812] via-[#111812]/50 to-transparent" />
                
                {/* Floating pill badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[11px] font-bold text-[#FFDE02] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>VIP Access Only</span>
                </div>

                {/* Left bottom content */}
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <div className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FFDE02]" />
                    <span>Special 1-Minute Offer</span>
                  </div>
                  <h4 className="font-extrabold text-base leading-snug text-white">
                    Unlock Off-Market Dubai Properties & Early Payment Plans
                  </h4>
                  <div className="pt-2 border-t border-white/10 text-[11px] text-neutral-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>RERA Certified Advisory</span>
                  </div>
                </div>
              </div>

              {/* Right Column / Content & Form */}
              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                {!isSubmitted ? (
                  <>
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 bg-[#FFDE02]/15 text-[#FFDE02] px-3 py-1 rounded-full text-xs font-bold border border-[#FFDE02]/30">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Private Real Estate Consultation</span>
                      </div>
                      <h2 className="text-2xl font-black tracking-tight text-white">
                        Find Your Ideal UAE Property
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                        Looking for high-yield investments or a luxury home? Speak directly with our senior property specialists for tailored portfolios.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex Morgan"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white/5 border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FFDE02] focus:ring-1 focus:ring-[#FFDE02] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-1">
                          Phone / WhatsApp Number
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            required
                            placeholder="+971 50 123 4567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FFDE02] focus:ring-1 focus:ring-[#FFDE02] transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-1">
                          Property Interest
                        </label>
                        <select
                          value={interest}
                          onChange={(e) => setInterest(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FFDE02] cursor-pointer"
                        >
                          <option value="Off-Plan Early Access">Off-Plan Early Launch Access</option>
                          <option value="Buy Luxury Villa">Buy Luxury Waterfront Villa</option>
                          <option value="High-Yield Apartment">High-Yield Rental (8-10% ROI)</option>
                          <option value="Commercial Office Space">Commercial / Office Space</option>
                          <option value="Golden Visa Advisory">Golden Visa Eligible Investment</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-2 bg-[#FFDE02] hover:bg-yellow-400 text-black py-3 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg hover:shadow-yellow-500/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                      >
                        <span>Request Free Consultation</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div className="flex items-center justify-center gap-4 pt-2">
                        <a
                          href="https://wa.me/971500000000?text=Hello%20MANZI,%20I'm%20interested%20in%20exclusive%20Dubai%20properties"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-neutral-400 hover:text-[#FFDE02] flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                          <span>Or Chat on WhatsApp</span>
                        </a>
                        <span className="text-neutral-600">•</span>
                        <button
                          type="button"
                          onClick={handleClose}
                          className="text-[11px] text-neutral-500 hover:text-white transition-colors"
                        >
                          Maybe later
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 px-4 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-white">
                      Request Received!
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 max-w-xs mx-auto">
                      Thank you, <strong className="text-white">{name || 'valued investor'}</strong>. A certified Dubai investment broker will contact you shortly via WhatsApp / phone.
                    </p>
                    <div className="text-[11px] text-neutral-500">
                      Closing in a moment...
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


import  { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReviewModal from '../../modals/website-feedback/webFeedbackModal';
import { serverBaseUrl } from '../../../utils/baseUrl';

// --- Utility for Tailwind classes ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company?: string;
  image: string;
  rating: number;
  text: string;
}


export default function WebFeedback() {
  const [testimonials, settestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //fetch backend feedbacks data
  const fetchFeedbacks = async () => {
    try {
      const res = await serverBaseUrl.get("/feedbacks");

      const formatted = res.data.data.map((item: any) => ({
        _id: item._id,
        name: item.user?.name || "Anonymous",
        role: item.user?.occupation || "Customer",
        company: "",
        image:
          item.user?.profileImage ||
          `https://i.pravatar.cc/150?u=${item._id}`,
        rating: item.rating,
        text: item.text,
      }));

      settestimonials(formatted);
    } catch (error) {
      console.error("Failed to fetch feedbacks", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);
  // --- Navigation Handlers ---
  const handleNext = useCallback(() => {
    if (testimonials.length === 0) return;

    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    if (testimonials.length === 0) return;

    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, [testimonials.length]);

  // --- Auto Slide Effect ---
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  // --- Position Logic ---
  const getPosition = (index: number) => {
    const len = testimonials.length;
    let distance = (index - activeIndex + len) % len;

    if (distance > len / 2) distance -= len;

    return distance;
  };

  // --- Animation Variants ---
  const getCardStyle = (position: number) => {
    const isActive = position === 0;
    const isNext = position === 1;
    const isPrev = position === -1;

    if (isActive) {
      return {
        x: 0,
        scale: 1,
        rotateY: 0,
        zIndex: 20,
        opacity: 1,
        filter: "blur(0px)",
      };
    }

    if (isNext) {
      return {
        x: 300,
        scale: 0.85,
        rotateY: -25,
        zIndex: 10,
        opacity: 0.5,
        filter: "blur(2px)",
      };
    }

    if (isPrev) {
      return {
        x: -300,
        scale: 0.85,
        rotateY: 25,
        zIndex: 10,
        opacity: 0.5,
        filter: "blur(2px)",
      };
    }

    return {
      x: position * 400,
      scale: 0.6,
      rotateY: position > 0 ? -45 : 45,
      zIndex: 5,
      opacity: 0,
      filter: "blur(4px)",
    };
  };

  const handleReviewSubmit = async (data: any) => {
    try {
      await serverBaseUrl.post("/feedbacks/create", data);
      await fetchFeedbacks();
      setActiveIndex(0);
    } catch (error) {
      console.error("Failed to submit review", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-neutral-900 flex flex-col items-center justify-center py-20 overflow-hidden">

      {/* --- Section Header --- */}
      <div className="mb-16 text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900">
          What Our Customers Say
        </h2>
        <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#ffca16] to-transparent mx-auto mt-4"></div>
      </div>

      {/* --- Carousel Container --- */}
      <div
        className="relative w-full max-w-6xl h-[520px] flex items-center justify-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-12 z-50 p-3 rounded-full bg-white/80 backdrop-blur-md border border-neutral-200 hover:bg-[#ffca16]/10 hover:border-[#ffca16]/30 transition-all group shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-neutral-600 group-hover:text-[#ffca16]" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 md:right-12 z-50 p-3 rounded-full bg-white/80 backdrop-blur-md border border-neutral-200 hover:bg-[#ffca16]/10 hover:border-[#ffca16]/30 transition-all group shadow-sm"
        >
          <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-[#ffca16]" />
        </button>

        {/* Cards Wrapper */}
        <div className="relative w-full h-full flex justify-center items-center">
          {testimonials.map((testimonial, index) => {
            const position = getPosition(index);

            if (Math.abs(position) > 2) return null;

            return (
              <motion.div
                key={testimonial._id}
                initial={false}
                animate={getCardStyle(position)}
                transition={{
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className={cn(
                  "absolute w-[340px] md:w-[420px] h-[440px] rounded-2xl p-8 flex flex-col",
                  // Glassmorphism with yellow tint on light background
                  "bg-[#ffca16]/5",
                  "backdrop-blur-xl border border-neutral-200/50",
                  "shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]"
                )}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                }}
              >
                {/* Subtle glow overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ffca16]/10 to-transparent opacity-50 pointer-events-none"></div>

                {/* Background Quote Icon */}
                <div className="absolute top-6 right-6 text-[#000000]/5 pointer-events-none">
                  <Quote size={50} fill="currentColor" />
                </div>

                {/* Profile Section */}
                <div className="relative z-10 flex items-start gap-4 mb-6">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffca16]/30 to-[#fbd44a]/30 blur-sm"></div>
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="relative w-14 h-14 rounded-full object-cover border border-[#ffca16]/20"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <h3 className="text-lg font-medium text-neutral-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs font-medium text-[#88abb8] mt-1">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {testimonial.company}
                    </p>
                  </div>
                </div>

                {/* Review Text */}
                <div className="relative z-10 flex-grow flex items-center">
                  <p className="text-lg leading-relaxed italic text-neutral-700 font-light">
                    "{testimonial.text}"
                  </p>
                </div>

                {/* Footer: Stars & Badge */}
                <div className="relative z-10 mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                  {/* Star Rating */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.floor(testimonial.rating) ? "#ffca16" : "none"}
                        className={i < Math.floor(testimonial.rating) ? "text-[#ffca16]" : "text-white/20"}
                      />
                    ))}
                  </div>

                  {/* Verified Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffca16]/5 backdrop-blur-sm border border-[#ffca16]">
                    <CheckCircle2 size={12} className="text-[#000000]" />
                    <span className="text-xs font-bold text-[#000000]/90">Verified</span>
                  </div>
                </div>

                {/* Active Card Glow */}
                {position === 0 && (
                  <motion.div
                    layoutId="glow"
                    className="absolute inset-0 -z-10 rounded-2xl bg-[#ffca16]/10 blur-2xl"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* --- Pagination Dots --- */}
      <div className="flex gap-2 mt-8 z-20">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              activeIndex === i
                ? "w-8 bg-[#ffca16]"
                : "w-1.5 bg-white/20 hover:bg-white/40"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* --- Feedback Button --- */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-12 px-8 py-3.5 border-2 border-[#ffffff] bg-gradient-to-r from-[#ffca16] to-[#fbd44a]/70 text-black cursor-pointer font-medium rounded-full flex items-center gap-2 shadow-[0_4px_24px_rgba(255,202,22,0.25)] hover:shadow-[0_4px_32px_rgba(255,202,22,0.35)] transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <MessageSquarePlus size={18} />
        <span>Give Feedback</span>
      </motion.button>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitReview={handleReviewSubmit
        }
      />

    </div>
  );
}

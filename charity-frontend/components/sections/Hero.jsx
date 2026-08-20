'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Mock Data - Backend থেকে আসার জন্য রেডি
const defaultBanners = [
  {
    id: 1,
    imageUrl: '/images/banner-1.jpg',
    title: 'শিক্ষাই আলো, শিক্ষাই মুক্তি',
    subtitle: 'প্রতিটি শিশুর জন্য মানসম্মত শিক্ষা নিশ্চিত করি',
    description: 'আমাদের শিক্ষা কার্যক্রমে ৫০০+ শিক্ষার্থী শিক্ষা গ্রহণ করছে। জ্ঞান অর্জনের মাধ্যমে তারা নিজেদের ভবিষ্যত গড়ছে।',
    ctaText: 'শিক্ষাবৃত্তির জন্য আবেদন করুন',
    ctaLink: '/scholarship',
    order: 1,
    isActive: true
  },
  {
    id: 2,
    imageUrl: '/images/banner-2.jpg',
    title: 'স্মার্ট বাংলাদেশ গড়ার স্বপ্ন',
    subtitle: 'প্রযুক্তি ও শিক্ষার সমন্বয়ে নতুন প্রজন্ম',
    description: 'ডিজিটাল শিক্ষার মাধ্যমে আমরা তৈরি করছি দক্ষ ও আত্মনির্ভরশীল জনগোষ্ঠী।',
    ctaText: 'শিক্ষাবৃত্তির জন্য আবেদন করুন',
    ctaLink: '/scholarship',
    order: 2,
    isActive: true
  },
  {
    id: 3,
    imageUrl: '/images/banner-3.jpg',
    title: 'শিক্ষা ছাড়া কোনো জাতি উন্নত হতে পারে না',
    subtitle: 'আমাদের লক্ষ্য - সবার জন্য শিক্ষা',
    description: 'সাতক্ষীরার প্রতিটি প্রান্তে পৌঁছে দিচ্ছি শিক্ষার আলো। আপনার সহযোগিতা আমাদের শক্তি।',
    ctaText: 'শিক্ষাবৃত্তির জন্য আবেদন করুন',
    ctaLink: '/scholarship',
    order: 3,
    isActive: true
  }
];

const Hero = () => {
  const [banners, setBanners] = useState(defaultBanners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      // ⏳ পরে API Call করবেন
      setTimeout(() => {
        setBanners(defaultBanners);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      setBanners(defaultBanners);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAutoPlay || loading || banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, banners.length, loading]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const currentBanner = banners[currentIndex] || banners[0];

  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="relative h-[600px] md:h-[700px] lg:h-[800px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Overlay */}
            <div className="absolute inset-0 z-10" style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)'
            }} />
            
            {/* Image */}
            <div className="relative w-full h-full">
              <Image
                src={currentBanner.imageUrl}
                alt={currentBanner.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container-xl mx-auto">
                <div className="max-w-3xl">
                  {/* Badge */}
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="inline-block bg-marigold/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-marigold/30"
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                  >
                    প্রতিষ্ঠিত ২০১৫ · রেজিস্টার্ড অলাভজনক সংস্থা
                  </motion.span>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
                  >
                    {currentBanner.title}
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="mt-4 text-xl md:text-2xl font-semibold"
                    style={{
                      color: '#FCD34D',
                      textShadow: '0 2px 15px rgba(0,0,0,0.4)'
                    }}
                  >
                    {currentBanner.subtitle}
                  </motion.p>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.7 }}
                    className="mt-4 text-base md:text-lg text-white/90 max-w-2xl leading-relaxed"
                    style={{ textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}
                  >
                    {currentBanner.description}
                  </motion.p>

                  {/* Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.7 }}
                    className="mt-8 flex flex-wrap gap-4"
                  >
                    <Link
                      href="/scholarship"
                      className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: '#FCD34D',
                        color: '#1B3A2F',
                        boxShadow: '0 4px 20px rgba(252, 211, 77, 0.4)'
                      }}
                    >
                      শিক্ষাবৃত্তির জন্য আবেদন করুন
                    </Link>
                    <Link
                      href="/#about"
                      className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        border: '2px solid rgba(255,255,255,0.5)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      আমাদের সম্পর্কে জানুন
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* ❌ Slide Counter REMOVED - সরানো হয়েছে */}

          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all hover:scale-110"
              style={{ backdropFilter: 'blur(5px)' }}
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all hover:scale-110"
              style={{ backdropFilter: 'blur(5px)' }}
            >
              <FaArrowRight className="text-xl" />
            </button>
          </>
        )}

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? 'w-10 h-2 bg-marigold'
                  : 'w-6 h-2 bg-white/50 hover:bg-white/70'
              } rounded-full`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
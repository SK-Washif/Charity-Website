'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { api } from '@/lib/api';

//Default Banners
const defaultBanners = [
  {
    id: 1,
    imageUrl: '/images/banner-1.jpg',
    title: 'শিক্ষাই আলো, শিক্ষাই মুক্তি',
    subtitle: 'দারিদ্র মেধাবী শিক্ষার্থীর শিক্ষা গ্রহণের সমতা নিশ্চিত করি',
    description: 'দরিদ্র এবং মেধাবী শিক্ষার্থীদের আর্থিক এবং ক্যারিয়ার সম্বন্ধীয় তথ্য দিয়ে সাহায্য করা হয়।',
    ctaText: 'শিক্ষাবৃত্তির জন্য আবেদন করুন',
    ctaLink: '/scholarship',
    order: 1,
    isActive: true
  },
  {
    id: 2,
    imageUrl: '/images/banner-2.jpg',
    title: 'প্রযুক্তি ও শিক্ষার সমন্বয়ে নতুন প্রজন্ম',
    subtitle: 'প্রযুক্তি ও শিক্ষার সমন্বয়ে নতুন প্রজন্ম',
    description: 'প্রযুক্তি বদলায় পৃথিবী, শিক্ষা বদলায় মানুষ—দুটির সমন্বয়ে বদলে যাক ভবিষ্যৎ।',
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
    description: 'প্রান্তিক এলাকার মেধাবী শিক্ষার্থীদের জন্য তৈরি হোক এগিয়ে যাওয়ার সুযোগ। আপনার সহযোগিতা আমাদের শক্তি।',
    ctaText: 'শিক্ষাবৃত্তির জন্য আবেদন করুন',
    ctaLink: '/scholarship',
    order: 3,
    isActive: true
  }
];

const Hero = () => {
  const [banners, setBanners] = useState(defaultBanners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await api.getBanners();
      
      console.log('📥 Hero fetch banners:', data);
      
      // ✅ Check if data exists and has items
      if (Array.isArray(data) && data.length > 0) {
        // Filter only active banners
        const activeBanners = data.filter(b => b.isActive !== false);
        if (activeBanners.length > 0) {
          // Map banners with proper imageUrl
          const mappedBanners = activeBanners.map(b => ({
            id: b.id || b._id,
            imageUrl: b.imageUrl || b.image || '/images/banner-1.jpg',
            title: b.title || 'শিক্ষাই আলো',
            subtitle: b.subtitle || '',
            description: b.description || '',
            ctaText: b.ctaText || 'শিক্ষাবৃত্তির জন্য আবেদন করুন',
            ctaLink: b.ctaLink || b.ctaLinks || '/scholarship',
            order: b.order || 0,
            isActive: b.isActive !== false,
          }));
          console.log('✅ Mapped banners:', mappedBanners);
          setBanners(mappedBanners);
          setLoading(false);
          return;
        }
      }
      
      // ✅ If no data from API, use default banners
      console.log('ℹ️ No banners from API, using default');
      setBanners(defaultBanners);
      
    } catch (error) {
      console.error('❌ Failed to fetch banners:', error);
      // ✅ On error, use default banners
      setBanners(defaultBanners);
    } finally {
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

  // Loading State
  if (loading) {
    return (
      <section className="relative overflow-hidden bg-paper">
        <div className="relative h-[600px] md:h-[700px] lg:h-[800px] w-full flex items-center justify-center">
          <FaSpinner className="animate-spin text-marigold text-4xl" />
        </div>
      </section>
    );
  }

  // ✅ Check if banners exist
  if (!banners || banners.length === 0) {
    return (
      <section className="relative overflow-hidden bg-paper">
        <div className="relative h-[600px] md:h-[700px] lg:h-[800px] w-full flex items-center justify-center">
          <p className="text-ink-muted">কোনো ব্যানার পাওয়া যায়নি।</p>
        </div>
      </section>
    );
  }

  const getImageUrl = (url) => {
    if (!url) return '/images/banner-1.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return url;
  };

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
              <img
                src={getImageUrl(currentBanner.imageUrl)}
                alt={currentBanner.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('❌ Image failed to load:', currentBanner.imageUrl);
                  e.target.src = '/images/banner-1.jpg';
                }}
              />
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container-xl mx-auto px-6 md:px-8 lg:px-12 w-full">
                <div className="max-w-3xl ml-0 md:ml-4 lg:ml-8">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="inline-block bg-marigold/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-marigold/30"
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                  >
                    প্রতিষ্ঠিত ২০২৪
                  </motion.span>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
                  >
                    {currentBanner.title}
                  </motion.h1>

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

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.7 }}
                    className="mt-4 text-base md:text-lg text-white/90 max-w-2xl leading-relaxed"
                    style={{ textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}
                  >
                    {currentBanner.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.7 }}
                    className="mt-8 flex flex-wrap gap-4"
                  >
                    <Link
                      href={currentBanner.ctaLink || '/scholarship'}
                      className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: '#FCD34D',
                        color: '#1B3A2F',
                        boxShadow: '0 4px 20px rgba(252, 211, 77, 0.4)'
                      }}
                    >
                      {currentBanner.ctaText || 'শিক্ষাবৃত্তির জন্য আবেদন করুন'}
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
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => {
                setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
                setIsAutoPlay(false);
                setTimeout(() => setIsAutoPlay(true), 10000);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all hover:scale-110"
              style={{ backdropFilter: 'blur(5px)' }}
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <button
              onClick={() => {
                setCurrentIndex((prev) => (prev + 1) % banners.length);
                setIsAutoPlay(false);
                setTimeout(() => setIsAutoPlay(true), 10000);
              }}
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
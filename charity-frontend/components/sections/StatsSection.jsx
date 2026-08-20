'use client';

import { motion } from 'framer-motion';
import { FaUsers, FaStar, FaHandsHelping, FaClock } from 'react-icons/fa';
import { useState, useEffect } from 'react';

// 📌 Mock Data - Backend থেকে আসার জন্য রেডি
const defaultStats = [
  { 
    id: 1,
    label: 'মেধাবী শিক্ষার্থী পেয়েছে বৃত্তি', 
    value: '214', 
    icon: FaUsers,
    suffix: '+'
  },
  { 
    id: 2,
    label: 'শিক্ষার্থী পেয়েছে A+', 
    value: '1,340', 
    icon: FaStar,
    suffix: '+'
  },
  { 
    id: 3,
    label: 'সক্রিয় শিক্ষা কার্যক্রম', 
    value: '5', 
    icon: FaHandsHelping,
    suffix: ''
  },
  { 
    id: 4,
    label: 'কার্যকর বছর', 
    value: '9', 
    icon: FaClock,
    suffix: '+'
  },
];

const StatsSection = () => {
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // ⏳ পরে API Call করবেন
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats(defaultStats);
    }
  };

  const AnimatedNumber = ({ value, suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const numericValue = parseInt(value.replace(/,/g, ''));
      const duration = 2000;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [value]);

    return (
      <span>
        {count.toLocaleString()}
        {suffix}
      </span>
    );
  };

  return (
    <section className="section bg-white border-b border-line mb-24">
      <div className="container-custom">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 font-display text-2xl md:text-3xl font-semibold text-ink"
        >
          এক নজরে আমাদের কার্যক্রম
        </motion.h2>

        <div className="grid gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group bg-paper hover:bg-white rounded-xl p-6 transition-all hover:shadow-lg border border-line hover:border-primary/20"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Icon className="text-primary text-2xl" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-primary">
                      <AnimatedNumber value={stat.value} suffix={stat.suffix || ''} />
                    </div>
                    <p className="text-ink-muted text-sm mt-1">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
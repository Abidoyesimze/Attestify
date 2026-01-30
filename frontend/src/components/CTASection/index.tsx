'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();

  return (
    <section ref={ref} className="py-20 sm:py-24 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        animate={
          reduceMotion
            ? { opacity: 1 }
            : {
                background: [
                  'linear-gradient(135deg, #059669 0%, #10b981 50%, #06b6d4 100%)',
                  'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #059669 100%)',
                  'linear-gradient(135deg, #06b6d4 0%, #059669 50%, #10b981 100%)',
                  'linear-gradient(135deg, #059669 0%, #10b981 50%, #06b6d4 100%)',
                ],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }
        }
        className="absolute inset-0"
      />

      {/* Floating Background Elements */}
      <motion.div
        animate={
          reduceMotion
            ? { opacity: 0.6 }
            : {
                y: [0, -16, 0],
                rotate: [0, 360],
                scale: [1, 1.08, 1],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 15,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
        className="absolute top-6 sm:top-10 left-6 sm:left-10 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl"
      />

      <motion.div
        animate={
          reduceMotion
            ? { opacity: 0.5 }
            : {
                y: [0, 24, 0],
                rotate: [360, 0],
                scale: [1, 0.92, 1],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 3,
              }
        }
        className="absolute bottom-8 sm:bottom-10 right-6 sm:right-10 w-28 h-28 sm:w-40 sm:h-40 bg-white/5 rounded-full blur-2xl"
      />

      <motion.div
        animate={
          reduceMotion
            ? { opacity: 0.4 }
            : {
                x: [0, 50, 0],
                y: [0, -30, 0],
                rotate: [0, 180, 360],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 25,
                repeat: Infinity,
                ease: 'linear',
                delay: 5,
              }
        }
        className="absolute top-1/2 left-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-white/8 rounded-full blur-lg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Sparkle Icons */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.2,
                      }
                }
                className="mx-1"
              >
                <Sparkles className="h-6 w-6 text-white/80" />
              </motion.div>
            ))}
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
          >
            Ready to Start Earning?
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Join verified users earning passive income on Celo
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              }}
              whileTap={{ scale: 0.95 }}
              className="group px-6 sm:px-8 py-4 bg-white text-green-600 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-3 relative overflow-hidden w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              {/* Button Background Animation */}
              <motion.div
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50"
              />
              
              <Link href="/dashboard" className="relative z-10 flex items-center gap-3">
                Launch App Now
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Link>
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-10 sm:mt-12 flex flex-wrap justify-center items-center gap-5 sm:gap-8 text-white/80 px-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">No minimum deposit</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm">Instant verification</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm">24/7 AI support</span>
            </motion.div>
          </motion.div>

          {/* Floating Particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

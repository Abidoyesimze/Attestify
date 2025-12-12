'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Shield, ArrowRight, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const trustIndicators = [
    { icon: Shield, text: 'Zero personal data stored', highlight: 'Zero' },
    { icon: DollarSign, text: 'fees', highlight: '$0' },
    { icon: ArrowRight, text: 'withdrawals', highlight: 'Instant' },
  ];

  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-18 md:pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={
            reduceMotion
              ? { scale: 1, rotate: 0 }
              : {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }
          }
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[440px] h-[440px] sm:w-[660px] sm:h-[660px] lg:w-[800px] lg:h-[800px] bg-gradient-to-br from-green-100/20 via-emerald-100/10 to-teal-100/20 rounded-full blur-2xl sm:blur-3xl"
        />
        <motion.div
          animate={
            reduceMotion
              ? { scale: 1, rotate: 0 }
              : {
                  scale: [1.05, 1, 1.05],
                  rotate: [0, -5, 0],
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
          className="absolute bottom-0 right-1/4 w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] lg:w-[600px] lg:h-[600px] bg-gradient-to-br from-blue-100/15 via-cyan-100/10 to-green-100/15 rounded-full blur-2xl sm:blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-green-200 rounded-full text-green-700 font-medium mb-6 backdrop-blur-sm shadow-lg"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="h-4 w-4" />
            </motion.div>
            <span className="text-sm">Built on Celo • Verified by Self Protocol</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-5 sm:mb-6"
          >
            Automated DeFi
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="block bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent"
            >
              Yield Generation
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="block text-3xl sm:text-5xl md:text-6xl mt-2"
            >
              on Celo
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
          >
            Verify once, earn forever. We <motion.span
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              className="font-semibold text-gray-900 inline-block"
            >
              deploy your funds
            </motion.span> to 
            DeFi protocols for <motion.span
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              className="font-semibold text-green-600 inline-block"
            >
              3-15% APY
            </motion.span>. 
            AI-powered, <motion.span
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              className="font-semibold text-gray-900 inline-block"
            >
              fully automated
            </motion.span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-10 sm:mb-12"
          >
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group px-6 sm:px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span>Launch App</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </motion.button>
            </Link>
            
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="#how-it-works"
              className="px-6 sm:px-8 py-4 bg-white/80 border-2 border-gray-200 text-gray-900 rounded-2xl font-semibold hover:border-gray-300 hover:shadow-md transition-all duration-300 flex items-center justify-center backdrop-blur-sm w-full sm:w-auto"
            >
              See How It Works
            </motion.a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-wrap justify-center items-center gap-3 sm:gap-5 text-sm text-gray-600 px-2"
          >
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/60 rounded-full backdrop-blur-sm hover:bg-white/80 transition-colors"
              >
                <indicator.icon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <span className="text-xs sm:text-sm">
                  <strong className="text-gray-900">{indicator.highlight}</strong> {indicator.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-20 left-10 hidden lg:block"
          >
            <div className="h-16 w-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl opacity-20 blur-sm" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 10, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute top-32 right-16 hidden lg:block"
          >
            <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl opacity-20 blur-sm" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
            className="absolute bottom-20 left-20 hidden lg:block"
          >
            <div className="h-8 w-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg opacity-20 blur-sm" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ArrowRight,
  Shield
} from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import ConnectWalletButton from '@/components/ConnectWalletButton';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: typeof Wallet;
}

const steps: Step[] = [
  {
    id: 'connect',
    title: 'Connect Wallet',
    description: 'Connect your wallet to get started',
    icon: Wallet
  },
  {
    id: 'verify',
    title: 'Verify Identity',
    description: 'Complete identity verification',
    icon: Shield
  },
  {
    id: 'ready',
    title: 'Ready to Go',
    description: 'You\'re all set to start investing',
    icon: CheckCircle2
  }
];

export default function WalletConnectionFlow() {
  const { address, isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      setCurrentStep(1);
      // Simulate verification check
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setCurrentStep(2);
      }, 2000);
    }
  }, [isConnected, address]);

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Get Started
        </h2>
        <p className="text-sm text-gray-600">
          Follow these steps to start investing
        </p>
      </div>

      {/* Progress Steps */}
      <div className="relative mb-8">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <motion.div
            className="absolute top-0 left-0 h-full bg-green-600"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div
                  className={`
                    relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                    ${isCompleted 
                      ? 'bg-green-600 text-white' 
                      : isActive 
                        ? 'bg-green-100 text-green-600 border-2 border-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </motion.div>
                <div className="mt-2 text-center max-w-[100px]">
                  <p className={`text-xs font-medium ${
                    isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="text-center"
        >
          <div className="mb-4">
            <Icon className={`h-12 w-12 mx-auto mb-3 ${
              currentStep === 0 
                ? 'text-gray-400' 
                : currentStep === 1 
                  ? 'text-green-600' 
                  : 'text-green-600'
            }`} />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentStepData.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-6">
            {currentStepData.description}
          </p>

          {currentStep === 0 && (
            <ConnectWalletButton />
          )}

          {currentStep === 1 && (
            <div className="flex items-center justify-center gap-2 text-green-600">
              {isVerifying ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Verification Complete</span>
                </>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

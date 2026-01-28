'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  Check, 
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { useChainId, useSwitchChain } from 'wagmi';

interface NetworkOption {
  id: number;
  name: string;
  icon?: string;
  testnet?: boolean;
}

const networks: NetworkOption[] = [
  { id: 44787, name: 'Celo Alfajores', testnet: true },
  { id: 42220, name: 'Celo Mainnet', testnet: false },
];

export default function NetworkSwitcher() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const [isOpen, setIsOpen] = useState(false);

  const currentNetwork = networks.find(n => n.id === chainId) || networks[0];

  const handleSwitch = (networkId: number) => {
    switchChain({ chainId: networkId });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        disabled={isPending}
      >
        <Network className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentNetwork.name}
        </span>
        {currentNetwork.testnet && (
          <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
            Testnet
          </span>
        )}
        <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
            >
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Select Network
                </div>
                {networks.map((network) => {
                  const isActive = network.id === chainId;
                  return (
                    <button
                      key={network.id}
                      onClick={() => handleSwitch(network.id)}
                      disabled={isPending || isActive}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg
                        transition-colors
                        ${isActive 
                          ? 'bg-green-50 text-green-700' 
                          : 'hover:bg-gray-50 text-gray-700'
                        }
                        ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <Network className="h-4 w-4" />
                        <span className="text-sm font-medium">{network.name}</span>
                        {network.testnet && (
                          <span className="px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                            Test
                          </span>
                        )}
                      </div>
                      {isActive && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="border-t border-gray-200 p-3 bg-gray-50">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Make sure your wallet supports the selected network before switching.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Check } from 'lucide-react';

interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

const colorSchemes: ColorScheme[] = [
  {
    id: 'green',
    name: 'Green',
    primary: '#35D07F',
    secondary: '#10b981',
    accent: '#059669'
  },
  {
    id: 'blue',
    name: 'Blue',
    primary: '#3b82f6',
    secondary: '#2563eb',
    accent: '#1d4ed8'
  },
  {
    id: 'purple',
    name: 'Purple',
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#6d28d9'
  },
  {
    id: 'orange',
    name: 'Orange',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#c2410c'
  }
];

interface ThemeCustomizerProps {
  currentTheme?: string;
  onThemeChange?: (themeId: string) => void;
}

export default function ThemeCustomizer({
  currentTheme = 'green',
  onThemeChange
}: ThemeCustomizerProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    onThemeChange?.(themeId);
    
    // Apply theme to document root
    const theme = colorSchemes.find(t => t.id === themeId);
    if (theme) {
      document.documentElement.style.setProperty('--color-primary', theme.primary);
      document.documentElement.style.setProperty('--color-secondary', theme.secondary);
      document.documentElement.style.setProperty('--color-accent', theme.accent);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Theme Customization
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color Scheme
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colorSchemes.map((scheme) => {
              const isSelected = selectedTheme === scheme.id;
              
              return (
                <motion.button
                  key={scheme.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleThemeSelect(scheme.id)}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all
                    ${isSelected 
                      ? 'border-gray-900 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-1">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: scheme.primary }}
                      />
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: scheme.secondary }}
                      />
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: scheme.accent }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      {scheme.name}
                    </span>
                  </div>
                  
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

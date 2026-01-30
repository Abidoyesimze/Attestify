import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './provider';

export const metadata: Metadata = {
  title: 'Attestify - Verified Savings on Celo',
  description: 'AI-powered investment vault with privacy-preserving identity verification. Built on Celo.',
  keywords: ['Celo', 'DeFi', 'Self Protocol', 'Savings', 'Aave Market'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:z-[60] focus:top-4 focus:left-4 focus:bg-white focus:text-gray-900 focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
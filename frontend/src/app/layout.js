import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LoopDrop Distributor - Multisig Token Distribution',
  description: 'Automated token distribution system for LoopDrops and Loyalty Rewards with Safe multisig integration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

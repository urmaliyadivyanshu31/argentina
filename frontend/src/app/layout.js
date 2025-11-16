import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'LoopDrop Distributor',
  description: 'Automated token distribution with Safe multisig integration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--color-white)',
                color: 'var(--color-black)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-small)',
              },
              className: 'monochrome-toast',
            }}
            closeButton
          />
        </Providers>
      </body>
    </html>
  );
}

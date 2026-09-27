import type { Metadata } from 'next';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { FitLogProvider } from '@/context/FitLogContext';
import { Toaster } from 'sonner';

import './globals.css';

export const metadata: Metadata = {
  title: 'FitLog | Workout Library',
  description:
    'FitLog is your workout library and daily fitness companion. Track exercises, build your plan, and log every set.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <FitLogProvider>
          <Navbar />

          <main>{children}</main>

          <Footer />

          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={3000}
            expand={false}
            theme="dark"
            visibleToasts={3}
          />
        </FitLogProvider>
      </body>
    </html>
  );
}

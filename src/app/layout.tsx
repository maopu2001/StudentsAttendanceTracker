import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import ReactQueryClientProvider from '@/components/ReactQueryClientProvider';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Student Attendance Tracker',
  description: 'Created by M. AKtaruzzaman Opu',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body className="min-h-svh w-full">
          <Header />
          {children}
          <Toaster />
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}

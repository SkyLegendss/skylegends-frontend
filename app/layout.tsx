import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sky Legends – Mytí fasád drony',
  description: 'Profesionální čištění fasád a oken výškových budov pomocí autonomních dronů. 39 Kč/m². Česká republika.',
  keywords: ['mytí fasád', 'čištění oken', 'drony', 'fasády', 'výškové budovy', 'Pardubice'],
  icons: {
    icon: '/drone-svgrepo-com.svg',
    shortcut: '/drone-svgrepo-com.svg',
    apple: '/drone-svgrepo-com.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className="dark">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}

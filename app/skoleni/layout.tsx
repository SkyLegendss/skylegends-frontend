import type { Metadata } from 'next';

const TITLE = 'Školení pilotů dronů pro začátečníky a firmy | Sky Legends';
const DESCRIPTION =
  'Praktické školení pilotů dronů pro začátečníky i firmy. Ovládání dronu, bezpečnost, plánování letu, legislativa a praktický výcvik se zkušenými piloty Sky Legends.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'školení dronů',
    'školení pilotů dronů',
    'kurz pilotování dronu',
    'kurz létání s dronem',
    'školení dronů pro firmy',
    'kurz dronu pro začátečníky',
    'příprava A1/A3',
    'příprava A2',
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/skoleni',
    type: 'website',
    images: ['/drone-svgrepo-com.svg'],
  },
};

export default function SkoleniLayout({ children }: { children: React.ReactNode }) {
  return children;
}


import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'GoldBarbearia | Agende seu Corte',
  description: 'A barbearia mais premium da cidade. Estilo, elegância e precisão.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&family=Montserrat:wght@700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

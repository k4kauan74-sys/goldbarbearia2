
import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'GoldBarbearia | High-End Grooming',
  description: 'A barbearia mais premium da cidade. Estilo, elegância e precisão.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Gold Barbearia',
  },
};

export const viewport: Viewport = {
  themeColor: '#030303',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var _f=window.fetch;var _sf=function(v){_f=v;};var _gf=function(){return _f;};try{Object.defineProperty(window,'fetch',{get:_gf,set:_sf,configurable:true,enumerable:true});}catch(e){}try{if(typeof Window!=='undefined'&&Window.prototype){Object.defineProperty(Window.prototype,'fetch',{get:_gf,set:_sf,configurable:true,enumerable:true});}}catch(e){}try{var p=Object.getPrototypeOf(window);if(p){Object.defineProperty(p,'fetch',{get:_gf,set:_sf,configurable:true,enumerable:true});}}catch(e){}}catch(e){}try{var oe=window.onerror;window.onerror=function(m,u){var s=String(m||'')+' '+String(u||'');if((s.indexOf('fetch')!==-1&&s.indexOf('getter')!==-1)||s.indexOf('chrome-extension')!==-1){return true;}if(oe)return oe.apply(this,arguments);};window.addEventListener('error',function(e){var s=String(e.message||(e.error&&e.error.message)||'')+' '+String(e.filename||'');if((s.indexOf('fetch')!==-1&&s.indexOf('getter')!==-1)||s.indexOf('chrome-extension')!==-1){e.preventDefault();e.stopImmediatePropagation();return true;}},true);window.addEventListener('unhandledrejection',function(e){var s=String((e.reason&&(e.reason.message||e.reason))||'');if((s.indexOf('fetch')!==-1&&s.indexOf('getter')!==-1)||s.indexOf('chrome-extension')!==-1){e.preventDefault();e.stopImmediatePropagation();}},true);}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="https://picsum.photos/seed/gold-icon-192/192/192" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background" suppressHydrationWarning>
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Montserrat, Geist } from "next/font/google";
import Script from "next/script"; // ⭐ LEGG TIL
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PawCursor from "@/components/PawCursor";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const mont = Montserrat({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Petsaco",
  description: "Pet store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        {/* 🔥 META PIXEL */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '957723226741904');
            fbq('track', 'PageView');
          `}
        </Script>
        {/* 🔥 GOOGLE ADS TAG */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18099784617"
          strategy="afterInteractive"
        />

        <Script id="google-ads-base" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'AW-18099784617');
  `}
        </Script>
      </head>

      <body className={`${mont.variable} antialiased`}>
        <Navbar />
        <PawCursor />
        {children}
        <Footer />
      </body>
    </html>
  );
}

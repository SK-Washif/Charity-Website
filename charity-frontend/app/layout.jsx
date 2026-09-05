import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui"; 
import "@clerk/ui/styles.css"; 
import { Spectral, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata = {
  title: {
    default: "ঐক্যতান ফাউন্ডেশন",
    template: "%s · ঐক্যতান ফাউন্ডেশন",
  },
  description:
    "মেধার বিকাশ ও সম্ভাবনার উন্মোচনে—ঐকতান ফাউন্ডেশন, শিক্ষার্থীর স্বপ্নের সহযাত্রী।",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider ui={ui}>
      <html lang="bn" data-theme="charity">
        <body
          className={`${spectral.variable} ${workSans.variable} ${plexMono.variable} antialiased`}
        >
          {children}
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        </body>
      </html>
    </ClerkProvider>
  );
}

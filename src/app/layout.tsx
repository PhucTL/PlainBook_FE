import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import QueryProvider from "@/components/providers/QueryProvider";
import LayoutProvider from "@/components/providers/LayoutProvider";
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plainbook - Nền tảng quản lý giảng dạy",
  description: "Nâng tầm giảng dạy với Kế hoạch Bài học chuyên nghiệp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
        <QueryProvider>
          <LayoutProvider>
            {children}
          </LayoutProvider>
          <ToastContainer />
        </QueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

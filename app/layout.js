// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "DeepSeek",
  description: "FullStack clone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <ClerkProvider>
        <AppContextProvider>
          <body className="antialiased">{children}</body>
        </AppContextProvider>
      </ClerkProvider>
    </html>
  );
}
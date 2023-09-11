import BottomMenue from "./components/BottomMenue";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextAuthProvider from "./providers/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agave",
  description: "アガベ管理用サービスです。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="stylesheet" href="../flowbite.min.css"></link>
      </head>
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
          <BottomMenue></BottomMenue>
        </NextAuthProvider>
        <script src="../flowbite.min.js"></script>
      </body>
    </html>
  );
}

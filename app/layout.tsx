import BottomMenu from "./components/BottomMenu";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextAuthProvider from "./providers/NextAuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "flowbite/dist/flowbite.min.css";

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
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
          <BottomMenu />
        </NextAuthProvider>
        <ToastContainer
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          position={"top-center"}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={"dark"}
        />
      </body>
    </html>
  );
}

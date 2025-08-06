import BottomMenu from "./components/BottomMenu";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextAuthProvider from "./providers/NextAuthProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "flowbite/dist/flowbite.min.css";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agrow",
  description: "アガベの管理サービスです。",
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
          <Header />
          {children}
          <BottomMenu />
        </NextAuthProvider>
        <ToastContainer
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          position={"top-center"}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName="rounded-full text-xs"
          theme={"dark"}
        />
        <div className="h-16 w-full"></div>
      </body>
    </html>
  );
}

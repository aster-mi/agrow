"use client";

import Link from "next/link";
import Image from "next/image";
import rackPng from "@/public/rack.png";
import { useSession } from "next-auth/react";
import useProfile from "../hooks/useProfile";

const BottomMenu = () => {
  const session = useSession();
  const { profile, profileError, profileLoading } = useProfile();
  return (
    <>
      {session.status === "authenticated" && (
        <div className="fixed z-50 w-full h-14 max-w-lg -translate-x-1/2 backdrop-blur-sm bg-black bg-opacity-50 rounded-full bottom-2 left-1/2">
          <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
            <div
              data-tooltip-target="tooltip-home"
              className="inline-flex flex-col items-center justify-center px-5 rounded-l-full"
            >
              <Link href="/">
                <svg
                  className="w-6 h-6 mb-1 text-white hover:text-green-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
              </Link>
            </div>

            <div
              data-tooltip-target="tooltip-wallet"
              className="inline-flex flex-col items-center justify-center px-5"
            >
              <Link href="/">
                <svg
                  className="w-6 h-6 mb-1 text-white hover:text-green-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M11.074 4 8.442.408A.95.95 0 0 0 7.014.254L2.926 4h8.148ZM9 13v-1a4 4 0 0 1 4-4h6V6a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-2h-6a4 4 0 0 1-4-4Z" />
                  <path d="M19 10h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm-4.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12.62 4h2.78L12.539.41a1.086 1.086 0 1 0-1.7 1.352L12.62 4Z" />
                </svg>
              </Link>
            </div>

            <div className="flex items-center justify-center">
              <Link
                href="/rack"
                className="bg-green-500 hover:bg-green-700 rounded-full p-2"
              >
                <Image
                  src={rackPng}
                  width={100}
                  alt="rack"
                  style={{ width: "25px", height: "25px" }}
                />
              </Link>
            </div>
            <div
              data-tooltip-target="tooltip-settings"
              className="inline-flex flex-col items-center justify-center px-5"
            >
              <Link href="/timeline">
                <svg
                  className="w-6 h-6 mb-1 text-white hover:text-green-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"
                  />
                </svg>
              </Link>
            </div>

            <div
              data-tooltip-target="tooltip-profile"
              className="inline-flex flex-col items-center justify-center px-5 rounded-r-full"
            >
              <Link href="/mypage">
                {profileLoading || profileError ? (
                  <svg
                    className="w-6 h-6 mb-1 text-white hover:text-green-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                  </svg>
                ) : (
                  <Image
                    src={profile?.image!}
                    width={30}
                    height={30}
                    alt="profile icon"
                    className="w-8 h-8 mb-1 rounded-full"
                  />
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default BottomMenu;

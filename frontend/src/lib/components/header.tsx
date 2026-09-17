"use client";

import Link from "next/link";
import { logoutAction } from "../services/auctionsAuth";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Logout01Icon,
  Tag01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

interface HeaderProps {
  isAuthenticated: boolean;
}

export const Header = ({ isAuthenticated }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
            <HugeiconsIcon icon={Tag01Icon} className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-white transition-colors group-hover:text-indigo-300">
              DarkBay
            </span>
            <span className="-mt-1 text-[10px] font-mono font-semibold uppercase tracking-widest text-indigo-400">
              Auktionen
            </span>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <nav className="flex items-center gap-2.5 sm:gap-4">
          <Link
            href="/"
            className="rounded-xl px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-900 hover:text-white"
          >
            Alle Auktionen
          </Link>

          {/* Create Auction Button */}
          <Link
            href="/auctions/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-95"
          >
            <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
            <span>Auktion erstellen</span>
          </Link>

          {/* Auth State Controls */}
          <div className="ml-1 flex items-center gap-2 border-l border-gray-800 pl-3">
            {isAuthenticated ? (
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:border-gray-700 hover:bg-gray-800 hover:text-white"
                >
                  <HugeiconsIcon icon={Logout01Icon} className="size-3.5 text-gray-400" />
                  <span className="hidden sm:inline">Abmelden</span>
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                >
                  <HugeiconsIcon icon={UserIcon} className="size-3.5 text-indigo-400" />
                  <span>Anmelden</span>
                </Link>
                <Link
                  href="/register"
                  className="hidden rounded-xl border border-gray-700 bg-gray-800/80 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800 sm:inline-flex"
                >
                  Registrieren
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

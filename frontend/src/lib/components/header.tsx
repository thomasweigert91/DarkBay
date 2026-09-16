"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  Logout01Icon,
  Login01Icon,
  ArrowDown01Icon,
  Loading01Icon,
} from "@hugeicons/core-free-icons";

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isLoggingOut, startLogoutTransition] = useTransition();

  const handleSignOut = () => {
    startLogoutTransition(async () => {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    });
  };

  // Determine initials for avatar
  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : (session?.user?.email?.[0]?.toUpperCase() ?? "U");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-950/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 outline-none transition-transform active:scale-95"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-shadow group-hover:shadow-indigo-500/40">
              <HugeiconsIcon icon={ShoppingBag01Icon} className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white">
                Dark<span className="text-indigo-400">Bay</span>
              </span>
              <span className="text-[10px] -mt-1 font-medium tracking-wider uppercase text-gray-400">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
                pathname === "/"
                  ? "bg-gray-800/90 text-white shadow-inner"
                  : "text-gray-300 hover:text-white hover:bg-gray-850",
              )}
            >
              Auctions
            </Link>
          </nav>
        </div>

        {/* Right Side: Authentication Controls */}
        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 animate-pulse rounded-full bg-gray-800/80" />
              <div className="size-9 animate-pulse rounded-full bg-gray-800/80" />
            </div>
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full p-1 text-gray-200 transition-colors hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-indigo-500/50">
                <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-xs font-bold text-white shadow-md shadow-indigo-600/30 ring-2 ring-gray-700/60 transition-transform group-hover:scale-105">
                  {userInitials}
                </div>
                <span className="hidden max-w-[120px] truncate text-sm font-medium text-gray-200 md:inline">
                  {session.user.name || session.user.email}
                </span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  className="hidden size-3.5 text-gray-400 md:inline"
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 border-gray-800 bg-gray-900/95 p-1.5 shadow-2xl backdrop-blur-md text-gray-200"
              >
                <DropdownMenuLabel className="px-3 py-2">
                  <p className="text-sm font-semibold text-white truncate">
                    {session.user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {session.user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />

                <DropdownMenuItem
                  onClick={() => router.push("/")}
                  className="text-gray-300 hover:text-white hover:bg-gray-800/80 cursor-pointer"
                >
                  <HugeiconsIcon
                    icon={ShoppingBag01Icon}
                    className="size-4 text-indigo-400"
                  />
                  <span>Browse Auctions</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-800" />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/40 cursor-pointer"
                >
                  {isLoggingOut ? (
                    <HugeiconsIcon
                      icon={Loading01Icon}
                      className="size-4 animate-spin"
                    />
                  ) : (
                    <HugeiconsIcon icon={Logout01Icon} className="size-4" />
                  )}
                  <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-gray-300 hover:text-white hover:bg-gray-800/80 gap-1.5 rounded-xl px-3.5",
                )}
              >
                <HugeiconsIcon
                  icon={Login01Icon}
                  className="size-4 text-gray-400"
                />
                <span>Sign In</span>
              </Link>
              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl px-4 shadow-sm shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50",
                )}
              >
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

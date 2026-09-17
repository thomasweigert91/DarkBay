"use client";
 
import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/lib/services/auctionsAuth";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Login01Icon,
  Mail01Icon,
  LockIcon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-gray-800 bg-gray-900/90 p-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shadow-inner">
            <HugeiconsIcon icon={Login01Icon} className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Willkommen zurück
          </h1>
          <p className="mt-1.5 text-xs text-gray-400">
            Melde dich an, um mitzubieten und eigene Auktionen einzustellen.
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-400">
              <HugeiconsIcon icon={Alert02Icon} className="size-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-300"
            >
              E-Mail Adresse
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className="size-4 text-indigo-400"
                />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="name@example.com"
                className="w-full rounded-xl border border-gray-800 bg-gray-950/80 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-300"
            >
              Passwort
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <HugeiconsIcon
                  icon={LockIcon}
                  className="size-4 text-indigo-400"
                />
              </div>
              <input
                type="password"
                name="password"
                id="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-800 bg-gray-950/80 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50"
            >
              {isPending ? "Wird angemeldet..." : "Anmelden"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 border-t border-gray-800/80 pt-4 text-center">
          <p className="text-xs text-gray-400">
            Noch kein Konto?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Hier registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { getCurrentUser } from "@/lib/services/auctionsAuth";
import { CreateAuctionForm } from "./_components/create-auction-form";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  LockIcon,
  Login01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";

export default async function NewAuctionPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Top Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-850 hover:text-white"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
            <span>Zurück zu Auktionen</span>
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-xs font-medium text-gray-400">
            Neue Auktion erstellen
          </span>
        </div>

        {!currentUser ? (
          /* Login Required Card */
          <div className="mx-auto max-w-md rounded-2xl border border-gray-800 bg-gray-900/90 p-8 text-center shadow-2xl backdrop-blur-md">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shadow-inner">
              <HugeiconsIcon icon={LockIcon} className="size-7" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Anmeldung erforderlich
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed">
              Um eine neue Auktion auf DarkBay einzustellen, musst du angemeldet
              sein.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/login"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-colors hover:bg-indigo-500"
              >
                <HugeiconsIcon icon={Login01Icon} className="size-4" />
                <span>Jetzt anmelden</span>
              </Link>
              <Link
                href="/register"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-xs font-semibold text-gray-200 transition-colors hover:bg-gray-750 hover:text-white"
              >
                <HugeiconsIcon icon={UserAdd01Icon} className="size-4" />
                <span>Konto erstellen</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Create Auction Interactive Form */
          <CreateAuctionForm />
        )}
      </div>
    </div>
  );
}

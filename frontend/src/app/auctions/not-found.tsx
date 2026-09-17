import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-gray-800 bg-gray-900/90 p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shadow-inner">
          <HugeiconsIcon icon={AlertCircleIcon} className="size-7" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Auktion nicht gefunden
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed">
          Die angeforderte Auktion existiert leider nicht oder wurde möglicherweise
          bereits archiviert.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            <span>Zurück zur Übersicht</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
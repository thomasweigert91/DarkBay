import Link from "next/link";
import { AuctionCard } from "@/lib/components/auction-card";
import { AuctionFilters } from "@/lib/components/auction-filters";
import { AppPagination } from "@/lib/components/pagination";
import { getAuctions } from "@/lib/services/auctionsService";
import { AuctionStatus } from "@/lib/types/auctions.types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Tag01Icon } from "@hugeicons/core-free-icons";

interface PageProps {
  searchParams: Promise<{
    status?: AuctionStatus;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const page = params.page ? Number(params.page) : 1;
  const status = params.status;

  const auctions = await getAuctions({
    status,
    minPrice,
    maxPrice,
    page,
  });

  const totalPages = auctions.meta.totalPages;
  const totalItems = auctions.meta.totalItems ?? auctions.data.length;
  const now = new Date();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Top Banner / Hero Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-gray-800 bg-gray-900/90 p-6 shadow-2xl backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-lg bg-indigo-600/90 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                Auktionshaus
              </span>
              <span className="text-xs font-mono text-gray-400">
                {totalItems} {totalItems === 1 ? "Artikel verfügbar" : "Artikel verfügbar"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Entdecke exklusive Auktionen
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-400">
              Biete live auf seltene Artikel oder erstelle unkompliziert deine eigene Auktion.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/auctions/new"
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
            >
              <HugeiconsIcon icon={Add01Icon} className="size-4" />
              <span>Auktion einstellen</span>
            </Link>
          </div>
        </div>

        {/* 2-Column Main Layout: Sidebar & Auction Grid */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar Filters */}
          <AuctionFilters
            currentStatus={status}
            currentMinPrice={minPrice}
            currentMaxPrice={maxPrice}
          />

          {/* Main Grid & Pagination */}
          <div className="flex-1 w-full min-w-0">
            {/* Grid Header Info */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {status === "open"
                  ? "Aktive Live-Auktionen"
                  : status === "closed"
                    ? "Beendete Auktionen"
                    : "Alle Auktionen"}
              </h2>
              <span className="text-xs font-medium text-gray-400">
                Seite {page} von {totalPages || 1}
              </span>
            </div>

            {auctions.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.data.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    id={auction.id}
                    title={auction.title}
                    currentPrice={auction.currentPrice}
                    endDate={auction.endDate}
                    isEnded={new Date(auction.endDate) <= now}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-800 bg-gray-900/60 p-12 text-center backdrop-blur-md shadow-xl">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-800/60 text-gray-500 mb-3 border border-gray-800">
                  <HugeiconsIcon icon={Tag01Icon} className="size-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Keine Auktionen gefunden
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-400 max-w-sm">
                  Für die gewählten Filterkriterien wurden keine Auktionen gefunden. Bitte passe deine Filter an.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <Link
                    href="/"
                    className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-xs font-medium text-gray-200 transition-colors hover:bg-gray-700 hover:text-white"
                  >
                    Filter zurücksetzen
                  </Link>
                  <Link
                    href="/auctions/new"
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
                  >
                    Auktion erstellen
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <AppPagination page={page} totalPages={totalPages} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

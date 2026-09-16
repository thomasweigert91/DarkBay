import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuctionById } from "@/lib/services/auctionsService";
import { getCurrentUser } from "@/lib/services/auctionsAuth";
import { BiddingPanel } from "./_components/bidding-panel";
import { BidHistory } from "./_components/bid-history";
import { SellerCard } from "./_components/seller-card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Calendar03Icon,
  Coins01Icon,
  InformationCircleIcon,
  Tag01Icon,
  Ticket01Icon,
} from "@hugeicons/core-free-icons";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AuctionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const auction = await getAuctionById(id);

  if (!auction) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const currentUserId = currentUser?.id;
  const isSeller = Boolean(currentUserId && currentUserId === auction.sellerId);
  const isAuthenticated = Boolean(currentUser);
  const isEnded = new Date(auction.endDate) <= new Date();

  const formattedStartDate = new Date(auction.startDate).toLocaleString(
    "de-DE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const formattedEndDate = new Date(auction.endDate).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Top Breadcrumb & Status Navigation */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 border border-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-850 transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
              <span>Zurück zu Auktionen</span>
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-xs font-medium text-gray-400 truncate max-w-xs sm:max-w-md">
              {auction.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isEnded ? (
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 border border-red-500/20">
                Auktion beendet
              </span>
            ) : (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Auktion
              </span>
            )}
          </div>
        </div>

        {/* 2-Column Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (2/3 width): Item details, description, specifications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Showcase / Hero Visual */}
            <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-900 shadow-2xl">
              <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-gray-900">
                <Image
                  src="/images/image.png"
                  alt={auction.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-lg bg-indigo-600/90 backdrop-blur-md px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                      DarkBay Artikel
                    </span>
                    <span className="text-xs font-mono text-gray-300">
                      #{auction.id.slice(0, 8)}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    {auction.title}
                  </h1>
                </div>
              </div>

              {/* Key Metrics Quickbar below image */}
              <div className="grid grid-cols-3 divide-x divide-gray-800 border-t border-gray-800 bg-gray-900/90 p-4">
                <div className="flex items-center gap-2.5 px-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-gray-800 text-indigo-400">
                    <HugeiconsIcon icon={Coins01Icon} className="size-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Startpreis</p>
                    <p className="font-semibold text-white">
                      {auction.startingPrice.toLocaleString("de-DE")} €
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-gray-800 text-emerald-400">
                    <HugeiconsIcon icon={Tag01Icon} className="size-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Aktuelles Gebot</p>
                    <p className="font-semibold text-emerald-400">
                      {auction.currentPrice.toLocaleString("de-DE")} €
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-gray-800 text-purple-400">
                    <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Auktionsende</p>
                    <p className="font-semibold text-white">
                      {formattedEndDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/90 p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-gray-800/80 pb-3 mb-4">
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  className="size-5 text-indigo-400"
                />
                <h2 className="text-lg font-semibold text-white">
                  Beschreibung
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {auction.description || "Keine weitere Beschreibung vorhanden."}
              </p>
            </div>

            {/* Technical Specifications / Auction Facts */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/90 p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-gray-800/80 pb-3 mb-4">
                <HugeiconsIcon
                  icon={Ticket01Icon}
                  className="size-5 text-indigo-400"
                />
                <h2 className="text-lg font-semibold text-white">
                  Auktions-Details & Spezifikationen
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between rounded-xl bg-gray-800/40 p-3 border border-gray-800">
                  <span className="text-gray-400">Auktions-ID</span>
                  <span className="font-mono font-medium text-gray-200">
                    #{auction.id.slice(0, 12)}...
                  </span>
                </div>

                <div className="flex justify-between rounded-xl bg-gray-800/40 p-3 border border-gray-800">
                  <span className="text-gray-400">Verkäufer-ID</span>
                  <span className="font-mono font-medium text-gray-200">
                    #{auction.sellerId.slice(0, 12)}...
                  </span>
                </div>

                <div className="flex justify-between rounded-xl bg-gray-800/40 p-3 border border-gray-800">
                  <span className="text-gray-400">Startpreis</span>
                  <span className="font-semibold text-white">
                    {auction.startingPrice.toLocaleString("de-DE")} €
                  </span>
                </div>

                <div className="flex justify-between rounded-xl bg-gray-800/40 p-3 border border-gray-800">
                  <span className="text-gray-400">Aktuelles Höchstgebot</span>
                  <span className="font-bold text-emerald-400">
                    {auction.currentPrice.toLocaleString("de-DE")} €
                  </span>
                </div>

                <div className="flex justify-between rounded-xl bg-gray-800/40 p-3 border border-gray-800">
                  <span className="text-gray-400">Nächstes Mindestgebot</span>
                  <span className="font-semibold text-indigo-300">
                    {(auction.currentPrice + 1).toLocaleString("de-DE")} €
                  </span>
                </div>

                <div className="flex justify-between rounded-xl bg-gray-800/40 p-3 border border-gray-800">
                  <span className="text-gray-400">Gesamtzahl Gebote</span>
                  <span className="font-medium text-white">
                    {auction.offers?.length ?? 0}
                  </span>
                </div>

                <div className="flex justify-between rounded-xl bg-gray-800/40 p-3 border border-gray-800">
                  <span className="text-gray-400">Startzeitpunkt</span>
                  <span className="font-medium text-gray-300">
                    {formattedStartDate}
                  </span>
                </div>

                <div className="flex justify-between rounded-xl bg-gray-800/40 p-3 border border-gray-800">
                  <span className="text-gray-400">Endzeitpunkt</span>
                  <span className="font-medium text-gray-300">
                    {formattedEndDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (1/3 width, sticky): Bidding Panel, Seller, History */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-20">
            {/* Interactive Bidding Panel */}
            <BiddingPanel
              auction={auction}
              isSeller={isSeller}
              isAuthenticated={isAuthenticated}
              currentUserId={currentUserId}
            />

            {/* Seller Information Card */}
            <SellerCard sellerId={auction.sellerId} isSeller={isSeller} />

            {/* Transaction / Bid History with Bidder userId */}
            <BidHistory offers={auction.offers} currentUserId={currentUserId} />
          </div>
        </div>
      </div>
    </div>
  );
}

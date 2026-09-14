import { getAuctionById } from "@/lib/services/auctionsService";
import { notFound } from "next/navigation";
import { BiddingPanel } from "./_components/bidding-panel";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AuctionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const auction = await getAuctionById(id);

  if (!auction) notFound();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <nav className="text-sm text-zinc-400 mb-1">
            Home / {auction.title}
          </nav>
          <h1 className="text-3xl font-bold text-white">{auction.title}</h1>
        </div>
        <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Featured Item
        </span>
      </div>

      {/* 2. Haupt-Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Linke Spalte (2/3 der Breite) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bildergalerie */}

          {/* Description */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-zinc-400">{auction.description}</p>
          </div>

          {/* Technical Specifications */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-xl font-semibold mb-3">
              Technical Specifications
            </h2>
            {/* Specs Table / Key-Values */}
          </div>
        </div>

        {/* Rechte Spalte (1/3 der Breite, idealerweise sticky) */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
          {/* Bidding Panel */}
          <BiddingPanel auction={auction} />

          {/* Seller Card */}
          {/* <SellerCard seller={auction.seller} /> */}

          {/* Transaction History */}
          {/* <BidHistory bids={auction.bids} /> */}
        </div>
      </div>
    </div>
  );
}

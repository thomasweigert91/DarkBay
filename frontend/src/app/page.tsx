import { AuctionCard } from "@/lib/components/auction-card";
import { getAuctions } from "@/lib/services/auctionsService";

export default async function Home() {
  const auctions = await getAuctions();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {auctions.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {auctions.data.map((auction) => (
              <AuctionCard
                key={auction.id}
                id={auction.id}
                title={auction.title}
                currentPrice={auction.currentPrice}
                endDate={auction.endDate}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500 dark:text-gray-400">
            No auctions available.
          </p>
        )}
      </main>
    </div>
  );
}

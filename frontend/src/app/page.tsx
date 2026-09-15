import { AuctionCard } from "@/lib/components/auction-card";
import { AuctionFilters } from "@/lib/components/auction-filters";
import { AuctionStatus, getAuctions } from "@/lib/services/auctionsService";

interface PageProps {
  searchParams: Promise<{
    status?: AuctionStatus;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const status = params.status;

  const auctions = await getAuctions({
    status,
    minPrice,
    maxPrice,
  });

  {
    /* Old version
		<div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">

			<main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
				{auctions.data.length > 0 ? (
					<>
						<aside>
							<h2>Filter</h2>
							<Slider defaultValue={[33]} max={100} step={1} />
						</aside>

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
					</>

				) : (
					<p className="text-center text-lg text-gray-500 dark:text-gray-400">
						No auctions available.
					</p>
				)}
			</main>
		</div> 
	*/
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* ----------------
				Sidebar 
			------------------*/}

      <AuctionFilters
        currentStatus={status}
        currentMinPrice={minPrice}
        currentMaxPrice={maxPrice}
      />

      {/* 
			<aside className="w-64 bg-gray-800 text-white p-5 m-3 space-y-4 rounded-md">
				<div className="flex-1 flex flex-col gap-2 ">
					<div className="flex items-center justify-between sm:min-w-[120px]">
						<span className="text-sm font-bold text-white">Price:</span>
						<span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-foreground">
							Min price - Max price
						</span>
					</div>
					<div className="flex-1 px-2 py-3">
						<Slider defaultValue={[33, 50]} max={100} step={1} />
					</div>
				</div>

				<div className="flex flex-col gap-2 pb-4 md:pb-0 md:pr-8">
					<span className="text-sm font-bold text-white min-w-[50px]">Status:</span>

					<div className="flex items-center gap-4">
						<div className="flex items-center space-x-2">
							<Checkbox
								id="open"
								checked={status === "open"}
								onCheckedChange={() => handleToggleStatus("open")}
							/>
							<Label htmlFor="open" className="text-sm font-normal cursor-pointer select-none">
								Open
							</Label>
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox
								id="closed"
								checked={status === "closed"}
								onCheckedChange={() => handleToggleStatus("closed")}
							/>
							<Label htmlFor="closed" className="text-sm font-normal cursor-pointer select-none">
								Closed
							</Label>
						</div>
					</div>
				</div>
			</aside>
			*/}

      {/* 
			------------------
				Main Content 
			----------------*/}

      <div className="flex-1 flex flex-col m-3">
        <header className="bg-gray-800 shadow p-4 font-semibold text-lg text-white rounded-md">
          Auctions List
        </header>
        <main className="flex-1 bg-gray-800 p-4 mt-4 overflow-y-auto rounded-md">
          <div className="rounded-lg h-full text-gray-500">
            {auctions.data.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
          </div>
        </main>
      </div>
    </div>
  );
}

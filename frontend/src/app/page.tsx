import { AuctionCard } from "@/lib/components/auction-card";
import { AuctionFilters } from "@/lib/components/auction-filters";
import { AppPagination } from "@/lib/components/pagination";
import { getAuctions } from "@/lib/services/auctionsService";
import { AuctionStatus } from "@/lib/types/auctions.types";

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
	const status = params.status;
	const page = params.page ? Number(params.page) : 1;

	const auctions = await getAuctions({
		status,
		minPrice,
		maxPrice,
		page,
	});
	const totalPages = auctions.meta.totalPages;

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
			------------------
				Main Content 
			----------------*/}

			<div className="flex-1 flex flex-col m-3">
				<header className="bg-gray-800 shadow p-4 font-semibold text-lg text-white rounded-md">Auctions List</header>
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
				{totalPages <= 1 ? (
					null
				) : <footer className="bg-gray-800 shadow p-4 mt-4 font-semibold text-lg text-white rounded-md">
					<AppPagination page={page} totalPages={totalPages} />
				</footer>}

			</div>

		</div>
	);
}

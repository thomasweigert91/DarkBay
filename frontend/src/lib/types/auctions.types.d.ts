export interface Auction {
	id: string;
	title: string;
	description: string;
	startingPrice: number;
	currentPrice: number;
	sellerId: string;
	startDate: string;
	endDate: string;
	offers?: Offer[];
}

export type AuctionStatus = "open" | "closed";

export interface GetAuctionsQuery {
	limit?: number;
	page?: number;
	minPrice?: number;
	maxPrice?: number;
	status?: AuctionStatus;
}

export interface PaginatedAuctionsResponse {
	data: Auction[];
	meta: {
		totalItems?: number,
		itemCount?: number,
		itemsPerPage?: number,
		totalPages: number,
		currentPage: number
	}
}
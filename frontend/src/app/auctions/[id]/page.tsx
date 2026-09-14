import { getAuctionById } from "@/lib/services/auctionsService";
import { notFound } from "next/navigation";

type PageProps = {
	params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
	const { id } = await params;
	const auction = await getAuctionById(id);
	if (!auction) {
		notFound();
	}
	return (
		<div>
			{auction.title}
			{auction.description}
			{auction.currentPrice}
			{auction.startDate}
		</div>

	)
}
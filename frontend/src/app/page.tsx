import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getAuctions } from "@/lib/services/auctionsService";
import Link from "next/link";


export default async function Home() {
	const auctions = await getAuctions();
	if (!auctions) {
		return <div>No auctions found</div>;
	}

	return (
		<div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
				{auctions.data.map(({ title, description, id }) => {
					return (
						<Link key={id} href={`/auctions/${id}`}>
							<Card className="w-full">
								<CardHeader>
									<CardTitle>{title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>{description}</CardDescription>
								</CardContent>
							</Card>
						</Link>
					);
				})}
			</main>
		</div>
	);
}

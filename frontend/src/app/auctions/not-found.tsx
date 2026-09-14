import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function notFound() {
	return (
		<div>
			<h2>Auction not found</h2>
			<p> The requested auction not found</p>
			<Link href="/" className={buttonVariants({ variant: "default" })}>Back to Home</Link>
		</div>
	)

}
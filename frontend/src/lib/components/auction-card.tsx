import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Countdown } from "./countdown";

interface AuctionCardProps {
  id: string;
  title: string;
  currentPrice: number;
  endDate: string;
}

export const AuctionCard: FC<AuctionCardProps> = ({
  currentPrice,
  id,
  endDate,
  title,
}) => {
  return (
    <Card className="p-0 group flex flex-col justify-between overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md max-w-3xl">
      <div>
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <Image
            src="/images/image.png"
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <CardHeader className="p-4 pb-2">
          <CardTitle
            className="line-clamp-1 text-base font-semibold tracking-tight text-foreground"
            title={title}
          >
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-3 p-4 pt-0">
          <div className="rounded-lg bg-muted/50 p-2.5">
            <p className="text-xs font-medium text-muted-foreground">
              Current Bid
            </p>
            <p className="text-sm font-bold tracking-tight text-foreground">
              ${currentPrice}
            </p>
          </div>

          <div className="rounded-lg bg-muted/50 p-2.5">
            <p className="text-xs font-medium text-muted-foreground">
              End Date
            </p>
            <Countdown endDate={endDate} />
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-4 pt-0">
        <Link
          href={`/auctions/${id}`}
          className={buttonVariants({
            variant: "default",
            className: "w-full font-medium transition-colors",
          })}
        >
          Place Bid
        </Link>
      </CardFooter>
    </Card>
  );
};

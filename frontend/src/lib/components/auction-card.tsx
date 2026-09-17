import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Countdown } from "./countdown";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  LockIcon,
  Coins01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface AuctionCardProps {
  id: string;
  title: string;
  currentPrice: number;
  endDate: string;
  isEnded?: boolean;
}

export const AuctionCard: FC<AuctionCardProps> = ({
  currentPrice,
  id,
  endDate,
  title,
  isEnded: isEndedProp,
}) => {
  const isEnded =
    isEndedProp !== undefined
      ? isEndedProp
      : new Date(endDate) <= new Date();

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-xl",
        isEnded
          ? "border-gray-800/60 bg-gray-900/50 opacity-85 hover:opacity-100 hover:border-gray-700 hover:bg-gray-900/80"
          : "border-gray-800 bg-gray-900/90 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-950/30",
      )}
    >
      <div>
        {/* Image Showcase */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-950">
          <Image
            src="/images/image.png"
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              "object-cover transition-all duration-500",
              isEnded
                ? "grayscale-[35%] group-hover:grayscale-0"
                : "group-hover:scale-105",
            )}
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent" />

          {/* Status Badge (Top-Left) */}
          <div className="absolute top-3 left-3 z-10">
            {isEnded ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-400 backdrop-blur-md shadow-sm">
                <HugeiconsIcon icon={LockIcon} className="size-3" />
                <span>Beendet</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md shadow-sm">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live</span>
              </span>
            )}
          </div>

          {/* ID Tag (Top-Right) */}
          <div className="absolute top-3 right-3 z-10">
            <span className="rounded-lg border border-gray-800/80 bg-gray-950/70 px-2 py-0.5 font-mono text-[10px] text-gray-300 backdrop-blur-md">
              #{id.slice(0, 6)}
            </span>
          </div>

          {/* Title on the bottom of the image */}
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <h3
              className="line-clamp-1 text-base font-bold text-white tracking-tight drop-shadow-sm group-hover:text-indigo-300 transition-colors"
              title={title}
            >
              {title}
            </h3>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-2 gap-2 p-3.5 pt-3">
          {/* Price Box */}
          <div className="flex flex-col rounded-xl border border-gray-800/60 bg-gray-800/40 p-2.5">
            <div className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
              <HugeiconsIcon icon={Coins01Icon} className="size-3 text-indigo-400" />
              <span>{isEnded ? "Endpreis" : "Aktuelles Gebot"}</span>
            </div>
            <p
              className={cn(
                "mt-0.5 text-sm font-extrabold tracking-tight",
                isEnded ? "text-gray-300" : "text-emerald-400",
              )}
            >
              {currentPrice.toLocaleString("de-DE")} €
            </p>
          </div>

          {/* Time/Status Box */}
          <div className="flex flex-col rounded-xl border border-gray-800/60 bg-gray-800/40 p-2.5">
            <div className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
              <HugeiconsIcon icon={Clock01Icon} className="size-3 text-indigo-400" />
              <span>{isEnded ? "Status" : "Verbleibend"}</span>
            </div>
            <div className="mt-0.5 text-xs font-semibold">
              {isEnded ? (
                <span className="text-red-400 font-medium">Auktion beendet</span>
              ) : (
                <span className="text-indigo-300">
                  <Countdown endDate={endDate} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3.5 pt-0">
        <Link
          href={`/auctions/${id}`}
          className={cn(
            "inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all active:scale-[0.98]",
            isEnded
              ? "border border-gray-700/80 bg-gray-800/80 text-gray-300 hover:bg-gray-800 hover:text-white"
              : "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500",
          )}
        >
          <span>{isEnded ? "Auktion ansehen" : "Gebot abgeben"}</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
        </Link>
      </div>
    </div>
  );
};

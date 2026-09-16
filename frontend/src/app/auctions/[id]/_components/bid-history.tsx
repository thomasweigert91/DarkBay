"use client";

import { FC } from "react";
import { Offer } from "@/lib/types/auctions.types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  Tag01Icon,
  TrophyIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";

interface BidHistoryProps {
  offers?: Offer[];
  currentUserId?: string;
}

export const BidHistory: FC<BidHistoryProps> = ({
  offers = [],
  currentUserId,
}) => {
  // Sort offers by date descending (newest first)
  const sortedOffers = [...offers].sort((a, b) => {
    return new Date(b.offerDate).getTime() - new Date(a.offerDate).getTime();
  });

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/90 p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Clock01Icon}
            className="size-4 text-indigo-400"
          />
          <h3 className="font-semibold text-white">Gebotsverlauf</h3>
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {sortedOffers.length} {sortedOffers.length === 1 ? "Gebot" : "Gebote"}
        </span>
      </div>

      {sortedOffers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
          <HugeiconsIcon
            icon={Tag01Icon}
            className="size-8 text-gray-600 mb-2"
          />
          <p className="text-sm font-medium text-gray-400">Noch keine Gebote</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Geben Sie das erste Gebot ab, um die Auktion zu starten!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {sortedOffers.map((offer, index) => {
            const isHighest = index === 0;
            const isOwnBid = Boolean(
              currentUserId && offer.userId && offer.userId === currentUserId,
            );

            const formattedDate = new Date(offer.offerDate).toLocaleString(
              "de-DE",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              },
            );

            return (
              <div
                key={offer.id || index}
                className={`flex items-center justify-between rounded-xl p-3 text-xs transition-colors border ${
                  isHighest
                    ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-200"
                    : "bg-gray-800/40 border-gray-800 text-gray-300 hover:bg-gray-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg shrink-0 ${
                      isHighest
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {isHighest ? (
                      <HugeiconsIcon icon={TrophyIcon} className="size-4" />
                    ) : (
                      <HugeiconsIcon icon={UserIcon} className="size-4" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Bidder User ID display */}
                      <span className="font-mono text-xs font-semibold text-white">
                        Bieter:{" "}
                        {offer.userId
                          ? `#${offer.userId.slice(0, 8)}...`
                          : "Unbekannt"}
                      </span>

                      {isOwnBid && (
                        <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                          Ihr Gebot
                        </span>
                      )}

                      {isHighest && (
                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                          Höchstbietend
                        </span>
                      )}
                    </div>

                    {/* Full user ID display for transparency */}
                    {offer.userId && (
                      <span
                        className="text-[10px] font-mono text-gray-400 truncate max-w-[200px]"
                        title={offer.userId}
                      >
                        ID: {offer.userId}
                      </span>
                    )}

                    <span className="text-[11px] text-gray-500 mt-0.5">
                      {formattedDate}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-white">
                    {offer.offer.toLocaleString("de-DE")} €
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

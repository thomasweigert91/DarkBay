"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { AuctionStatus } from "@/lib/types/auctions.types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Coins01Icon,
  FilterIcon,
  FilterResetIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 10000;

interface AuctionFiltersProps {
  currentStatus?: AuctionStatus;
  currentMinPrice?: number;
  currentMaxPrice?: number;
}

export function AuctionFilters({
  currentStatus,
  currentMinPrice = DEFAULT_MIN_PRICE,
  currentMaxPrice = DEFAULT_MAX_PRICE,
}: AuctionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [priceRange, setPriceRange] = useState<number[]>([
    currentMinPrice,
    currentMaxPrice,
  ]);

  const [prevPrices, setPrevPrices] = useState({
    min: currentMinPrice,
    max: currentMaxPrice,
  });

  if (
    prevPrices.min !== currentMinPrice ||
    prevPrices.max !== currentMaxPrice
  ) {
    setPrevPrices({ min: currentMinPrice, max: currentMaxPrice });
    setPriceRange([currentMinPrice, currentMaxPrice]);
  }

  const updateQueryParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      params.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, pathname, router],
  );

  const handleToggleStatus = (status: AuctionStatus) => {
    const newStatus = currentStatus === status ? undefined : status;
    updateQueryParams({ status: newStatus });
  };

  const handleResetFilters = () => {
    setPriceRange([DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE]);
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasActiveFilters = Boolean(
    currentStatus ||
      priceRange[0] > DEFAULT_MIN_PRICE ||
      priceRange[1] < DEFAULT_MAX_PRICE,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        priceRange[0] !== currentMinPrice ||
        priceRange[1] !== currentMaxPrice
      ) {
        updateQueryParams({
          minPrice:
            priceRange[0] > DEFAULT_MIN_PRICE
              ? String(priceRange[0])
              : undefined,
          maxPrice:
            priceRange[1] < DEFAULT_MAX_PRICE
              ? String(priceRange[1])
              : undefined,
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [priceRange, currentMinPrice, currentMaxPrice, updateQueryParams]);

  return (
    <aside className="w-full md:w-72 shrink-0 rounded-2xl border border-gray-800 bg-gray-900/90 p-5 shadow-xl backdrop-blur-md space-y-6 self-start">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
            <HugeiconsIcon icon={FilterIcon} className="size-4" />
          </div>
          <h3 className="font-semibold text-white">Filter</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            type="button"
            className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-indigo-300 transition-colors"
          >
            <HugeiconsIcon icon={FilterResetIcon} className="size-3" />
            <span>Zurücksetzen</span>
          </button>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
            <HugeiconsIcon icon={Coins01Icon} className="size-3.5 text-indigo-400" />
            <span>Preisspanne:</span>
          </div>
          <span className="rounded-lg border border-gray-800 bg-gray-950/70 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-400">
            {priceRange[0].toLocaleString("de-DE")} € - {priceRange[1].toLocaleString("de-DE")} €
          </span>
        </div>

        <div className="px-1 py-2">
          <Slider
            value={priceRange}
            min={DEFAULT_MIN_PRICE}
            max={DEFAULT_MAX_PRICE}
            step={10}
            onValueChange={(val) => {
              if (Array.isArray(val)) setPriceRange(val);
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-500 font-mono">
          <span>0 €</span>
          <span>10.000 €</span>
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-3 border-t border-gray-800/80 pt-4">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
          <HugeiconsIcon icon={Clock01Icon} className="size-3.5 text-indigo-400" />
          <span>Status:</span>
        </div>

        <div className="space-y-2.5">
          {/* Open / Active Filter */}
          <label
            htmlFor="open"
            className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-800/60 bg-gray-800/30 p-2.5 transition-colors hover:bg-gray-800/60"
          >
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="open"
                checked={currentStatus === "open"}
                onCheckedChange={() => handleToggleStatus("open")}
              />
              <span className="text-xs font-medium text-gray-200">
                Live Auktionen (offen)
              </span>
            </div>
            <span className="size-2 rounded-full bg-emerald-400" />
          </label>

          {/* Closed / Ended Filter */}
          <label
            htmlFor="closed"
            className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-800/60 bg-gray-800/30 p-2.5 transition-colors hover:bg-gray-800/60"
          >
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="closed"
                checked={currentStatus === "closed"}
                onCheckedChange={() => handleToggleStatus("closed")}
              />
              <span className="text-xs font-medium text-gray-200">
                Beendete Auktionen
              </span>
            </div>
            <span className="size-2 rounded-full bg-red-400" />
          </label>
        </div>
      </div>
    </aside>
  );
}

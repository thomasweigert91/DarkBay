"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AuctionStatus } from "@/lib/types/auctions.types";

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

  const updateQueryParams = (updates: Record<string, string | undefined>) => {
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
  };

  const handleToggleStatus = (status: AuctionStatus) => {
    const newStatus = currentStatus === status ? undefined : status;
    updateQueryParams({ status: newStatus });
  };

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
  }, [priceRange]);

  return (
    <aside className="w-64 bg-gray-800 text-white p-5 m-3 space-y-6 rounded-md self-start">
      {/* Price Filter */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-white">Price:</span>
          <span className="text-xs font-mono bg-gray-700 px-2 py-0.5 rounded text-gray-200">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <div className="px-2 py-3">
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
      </div>

      {/* Status Filter */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-white">Status:</span>

        <div className="flex items-center gap-4">
          {/* Open */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="open"
              checked={currentStatus === "open"}
              onCheckedChange={() => handleToggleStatus("open")}
            />
            <Label
              htmlFor="open"
              className="text-sm font-normal cursor-pointer select-none"
            >
              Open
            </Label>
          </div>

          {/* Closed */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="closed"
              checked={currentStatus === "closed"}
              onCheckedChange={() => handleToggleStatus("closed")}
            />
            <Label
              htmlFor="closed"
              className="text-sm font-normal cursor-pointer select-none"
            >
              Closed
            </Label>
          </div>
        </div>
      </div>
    </aside>
  );
}

"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createAuctionAction } from "@/lib/services/auctionsAuth";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Coins01Icon,
  InformationCircleIcon,
  Loading01Icon,
  Ticket01Icon,
} from "@hugeicons/core-free-icons";

type DurationOption = "1" | "3" | "7" | "14" | "custom";

export function CreateAuctionForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState<number | "">(10);
  const [durationOption, setDurationOption] = useState<DurationOption>("3");

  // Calculate default 3 days from now
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() + 3);
  const [customEndDate, setCustomEndDate] = useState<string>(
    defaultEndDate.toISOString().slice(0, 16),
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compute calculated end date for preview and submission
  const getComputedEndDate = (): string => {
    if (durationOption === "custom") {
      return customEndDate ? new Date(customEndDate).toISOString() : defaultEndDate.toISOString();
    }
    const days = parseInt(durationOption, 10);
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  };

  const computedEndDate = getComputedEndDate();
  const formattedEndDate = new Date(computedEndDate).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const price = typeof startingPrice === "number" ? startingPrice : parseFloat(startingPrice);
    if (isNaN(price) || price < 1) {
      setErrorMessage("Der Startpreis muss mindestens 1 € betragen.");
      return;
    }

    if (!title.trim()) {
      setErrorMessage("Bitte gib einen Titel für die Auktion ein.");
      return;
    }

    startTransition(async () => {
      try {
        const newAuction = await createAuctionAction({
          title: title.trim(),
          description: description.trim(),
          startingPrice: price,
          endDate: computedEndDate,
        });

        if (newAuction && newAuction.id) {
          router.push(`/auctions/${newAuction.id}`);
        } else {
          router.push("/");
        }
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Auktion konnte nicht erstellt werden. Bitte versuche es erneut.";
        setErrorMessage(msg);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column (5/12): Live Preview & Information */}
      <div className="lg:col-span-5 space-y-6">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/90 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-gray-800/80 pb-3 mb-4">
            <HugeiconsIcon icon={Ticket01Icon} className="size-4 text-indigo-400" />
            <h3 className="font-semibold text-white">Live-Vorschau deiner Karte</h3>
          </div>

          {/* Card Preview */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-950/80 shadow-2xl">
            {/* Standard Image Banner */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-900">
              <Image
                src="/images/image.png"
                alt={title || "DarkBay Artikel"}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md shadow-sm">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Vorschau</span>
                </span>
              </div>

              {/* Tag Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className="rounded-lg border border-gray-800/80 bg-gray-950/70 px-2 py-0.5 font-mono text-[10px] text-gray-300 backdrop-blur-md">
                  #NEU
                </span>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-3 left-3 right-3 z-10">
                <h4 className="line-clamp-1 text-base font-bold text-white tracking-tight">
                  {title || "Titel deiner Auktion..."}
                </h4>
              </div>
            </div>

            {/* Metrics Preview */}
            <div className="grid grid-cols-2 gap-2 p-3.5 pt-3">
              <div className="flex flex-col rounded-xl border border-gray-800/60 bg-gray-800/40 p-2.5">
                <span className="text-[11px] font-medium text-gray-400">
                  Startpreis
                </span>
                <p className="mt-0.5 text-sm font-extrabold text-emerald-400">
                  {(Number(startingPrice) || 0).toLocaleString("de-DE")} €
                </p>
              </div>

              <div className="flex flex-col rounded-xl border border-gray-800/60 bg-gray-800/40 p-2.5">
                <span className="text-[11px] font-medium text-gray-400">
                  Auktionsende
                </span>
                <p className="mt-0.5 text-xs font-semibold text-indigo-300 truncate">
                  {formattedEndDate}
                </p>
              </div>
            </div>
          </div>

          {/* Fixed Image Notice */}
          <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-3.5 text-xs text-indigo-200 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-300">
              <HugeiconsIcon icon={InformationCircleIcon} className="size-4 text-indigo-400" />
              <span>Einheitliches Produktbild</span>
            </div>
            <p className="text-[11px] text-indigo-200/80 leading-relaxed">
              Für alle Angebote auf DarkBay wird automatisch das offizielle
              Standardbild genutzt. Es ist kein eigener Bildupload erforderlich.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column (7/12): Interactive Form */}
      <div className="lg:col-span-7">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-800 bg-gray-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6"
        >
          <div className="border-b border-gray-800/80 pb-4">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Auktionsdetails festlegen
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Fülle die Angaben aus, um deinen Artikel einzustellen.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300">
              <HugeiconsIcon icon={AlertCircleIcon} className="size-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title Field */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
              Titel der Auktion <span className="text-indigo-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z. B. Vintage Sammlerstück oder Seltene Grafikkarte"
              className="w-full rounded-xl border border-gray-800 bg-gray-950/80 px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>Prägnanter Titel für Bieter</span>
              <span>{title.length}/120</span>
            </div>
          </div>

          {/* Starting Price Field */}
          <div className="space-y-2">
            <label htmlFor="startingPrice" className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
              Startpreis (€) <span className="text-indigo-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <HugeiconsIcon icon={Coins01Icon} className="size-4 text-indigo-400" />
              </div>
              <input
                id="startingPrice"
                type="number"
                min="1"
                step="1"
                required
                value={startingPrice}
                onChange={(e) =>
                  setStartingPrice(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="10"
                className="w-full rounded-xl border border-gray-800 bg-gray-950/80 pl-10 pr-10 py-2.5 text-sm font-semibold text-emerald-400 placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 font-bold text-gray-400">
                €
              </div>
            </div>
            <p className="text-[11px] text-gray-500">
              Mindestgebot, mit dem die Auktion startet.
            </p>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
              Auktionsdauer / Laufzeit
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["1", "3", "7", "14"] as const).map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setDurationOption(days)}
                  className={`rounded-xl border py-2 px-3 text-xs font-semibold transition-all cursor-pointer ${
                    durationOption === days
                      ? "border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "border-gray-800 bg-gray-950/60 text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {days} {days === "1" ? "Tag" : "Tage"}
                </button>
              ))}
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setDurationOption("custom")}
                className={`text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  durationOption === "custom"
                    ? "text-indigo-400 underline font-semibold"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
                <span>Benutzerdefiniertes Enddatum wählen</span>
              </button>

              {durationOption === "custom" && (
                <div className="mt-2">
                  <input
                    type="datetime-local"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950/80 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <p className="text-[11px] text-indigo-300/80">
              Endet am: <span className="font-semibold text-white">{formattedEndDate}</span>
            </p>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
              Artikelbeschreibung
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detaillierte Informationen zum Zustand, Besonderheiten und Lieferumfang..."
              className="w-full rounded-xl border border-gray-800 bg-gray-950/80 p-3.5 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <HugeiconsIcon icon={Loading01Icon} className="size-4 animate-spin" />
                  <span>Auktion wird erstellt...</span>
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                  <span>Auktion jetzt veröffentlichen</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

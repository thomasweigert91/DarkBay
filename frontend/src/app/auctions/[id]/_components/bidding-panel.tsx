"use client";

import { FC, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Countdown } from "@/lib/components/countdown";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createOfferAction } from "@/lib/services/auctionsAuth";
import { Auction } from "@/lib/types/auctions.types";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	AlertCircleIcon,
	CheckmarkCircle02Icon,
	Loading01Icon,
	LockIcon,
	Login01Icon,
} from "@hugeicons/core-free-icons";

interface BiddingPanelProps {
	auction: Auction;
	isSeller: boolean;
	isAuthenticated: boolean;
	currentUserId?: string;
}

const createFormSchema = (currentPrice: number) => {
	const minBid = Math.max(1, currentPrice + 1);
	return z.object({
		bid: z
			.number({ message: "Bitte eine gültige Zahl eingeben" })
			.min(1, { message: "Das Gebot muss mindestens 1 € betragen" })
			.min(minBid, {
				message: `Das Gebot muss mindestens ${minBid.toLocaleString("de-DE")} € betragen (höher als ${currentPrice.toLocaleString("de-DE")} €)`,
			}),
	});
};

export const BiddingPanel: FC<BiddingPanelProps> = ({
	auction,
	isSeller,
	isAuthenticated,
}) => {
	const router = useRouter();
	const [statusMessage, setStatusMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const [isSubmitting, startTransition] = useTransition();

	const isEnded = new Date(auction.endDate) <= new Date();

	const formSchema = useMemo(
		() => createFormSchema(auction.currentPrice),
		[auction.currentPrice]
	);

	const {
		handleSubmit,
		control,
		setValue,
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		values: {
			bid: auction.currentPrice + 1,
		},
	});

	const watchedBid = useWatch({ control, name: "bid" });

	const handleQuickBid = (increment: number) => {
		setStatusMessage(null);
		const newBid = auction.currentPrice + increment;
		setValue("bid", newBid, { shouldValidate: true, shouldDirty: true });
	};

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		setStatusMessage(null);
		startTransition(async () => {
			try {
				await createOfferAction(auction.id, data.bid);
				setStatusMessage({
					type: "success",
					text: `Gebot von ${data.bid.toLocaleString("de-DE")} € erfolgreich abgegeben!`,
				});
				router.refresh();
			} catch (err: unknown) {
				const errorMsg =
					err instanceof Error
						? err.message
						: "Gebot konnte nicht abgegeben werden. Bitte versuchen Sie es erneut.";
				setStatusMessage({
					type: "error",
					text: errorMsg,
				});
			}
		});
	};

	const isBiddingDisabled = isSeller || isEnded || !isAuthenticated || isSubmitting;

	return (
		<div
			className={cn(
				"rounded-2xl border bg-gray-900/90 p-5 shadow-xl backdrop-blur-md transition-all",
				isSeller
					? "border-amber-500/40 bg-amber-950/10 shadow-amber-950/20"
					: "border-gray-800"
			)}
		>
			<div className="flex flex-col gap-4">
				{/* Title & Status Header */}
				<div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
					<h3 className="font-semibold text-white">Bidding Panel</h3>
					{isEnded ? (
						<span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-medium text-red-400 border border-red-500/30">
							Beendet
						</span>
					) : (
						<span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
							<span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
							Aktiv
						</span>
					)}
				</div>

				{/* Price Display */}
				<div className="flex flex-col items-center justify-center rounded-xl bg-gray-950/60 py-3.5 border border-gray-800/60">
					<span className="text-xs font-medium uppercase tracking-wider text-gray-400">
						Aktuelles Höchstgebot
					</span>
					<span className="mt-0.5 text-3xl font-extrabold tracking-tight text-emerald-400">
						{auction.currentPrice.toLocaleString("de-DE")} €
					</span>
					<span className="mt-1 text-[11px] text-gray-500">
						Startpreis: {auction.startingPrice.toLocaleString("de-DE")} €
					</span>
				</div>

				{/* Stats Grid: Offer Count & Time Left */}
				<div className="grid grid-cols-2 gap-3 text-center border-b border-gray-800/80 pb-4">
					<div className="rounded-xl bg-gray-800/40 p-2.5 border border-gray-800/60">
						<p className="text-xs font-medium text-gray-400">Gebote</p>
						<p className="mt-0.5 text-lg font-bold text-white">
							{auction.offers?.length ?? 0}
						</p>
					</div>
					<div className="rounded-xl bg-gray-800/40 p-2.5 border border-gray-800/60">
						<p className="text-xs font-medium text-gray-400">Verbleibend</p>
						<p className="mt-0.5 text-sm font-semibold text-indigo-300">
							<Countdown endDate={auction.endDate} />
						</p>
					</div>
				</div>

				{/* Notice Banner: Auction Creator / Seller */}
				{isSeller && (
					<div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200 flex items-start gap-2.5 shadow-sm">
						<HugeiconsIcon
							icon={AlertCircleIcon}
							className="size-5 shrink-0 text-amber-400 mt-0.5"
						/>
						<div>
							<p className="font-semibold text-amber-300">
								Eigene Auktion
							</p>
							<p className="text-xs text-amber-200/90 mt-0.5">
								Sie sind der Ersteller dieser Auktion. Das Bieten auf eigene Auktionen ist nicht gestattet.
							</p>
						</div>
					</div>
				)}

				{/* Notice Banner: Ended Auction */}
				{!isSeller && isEnded && (
					<div className="rounded-xl border border-gray-700 bg-gray-800/50 p-3 text-sm text-gray-300 flex items-center gap-2.5">
						<HugeiconsIcon icon={LockIcon} className="size-4 shrink-0 text-gray-400" />
						<span className="text-xs">
							Diese Auktion ist beendet. Es können keine weiteren Gebote abgegeben werden.
						</span>
					</div>
				)}

				{/* Notice Banner: Not Logged In */}
				{!isAuthenticated && !isEnded && (
					<div className="rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-3 text-sm text-indigo-200 flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<HugeiconsIcon icon={Login01Icon} className="size-4 text-indigo-400" />
							<span className="text-xs font-medium">
								Anmeldung erforderlich
							</span>
						</div>
						<p className="text-xs text-indigo-200/80">
							Bitte melden Sie sich an, um an dieser Auktion teilzunehmen und Gebote abzugeben.
						</p>
						<Link
							href="/login"
							className="mt-1 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm"
						>
							Jetzt anmelden
						</Link>
					</div>
				)}

				{/* Status Message (Success or Server Error) */}
				{statusMessage && (
					<div
						className={cn(
							"rounded-xl p-3 text-xs flex items-center gap-2 border",
							statusMessage.type === "success"
								? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
								: "border-red-500/40 bg-red-950/40 text-red-300"
						)}
					>
						<HugeiconsIcon
							icon={
								statusMessage.type === "success"
									? CheckmarkCircle02Icon
									: AlertCircleIcon
							}
							className="size-4 shrink-0"
						/>
						<span>{statusMessage.text}</span>
					</div>
				)}

				{/* Interactive Bidding Form & Quick Bids Container */}
				<div
					className={cn(
						"flex flex-col gap-4 transition-opacity",
						isBiddingDisabled && "opacity-40 pointer-events-none select-none"
					)}
				>
					{/* Quick Bids */}
					<div>
						<p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
							Schnellgebot
						</p>
						<div className="grid grid-cols-3 gap-2 mt-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={isBiddingDisabled}
								onClick={() => handleQuickBid(50)}
								className="border-gray-700 bg-gray-800/80 hover:bg-gray-700 text-white cursor-pointer"
							>
								+50 €
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={isBiddingDisabled}
								onClick={() => handleQuickBid(100)}
								className="border-gray-700 bg-gray-800/80 hover:bg-gray-700 text-white cursor-pointer"
							>
								+100 €
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={isBiddingDisabled}
								onClick={() => handleQuickBid(200)}
								className="border-gray-700 bg-gray-800/80 hover:bg-gray-700 text-white cursor-pointer"
							>
								+200 €
							</Button>
						</div>
					</div>

					{/* Custom Bid Form */}
					<form id="bid-form" onSubmit={handleSubmit(onSubmit)}>
						<Controller
							control={control}
							name="bid"
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel className="text-xs font-semibold uppercase tracking-wider text-gray-400">
										Individuelles Gebot (€)
									</FieldLabel>
									<div className="relative mt-1">
										<Input
											{...field}
											type="number"
											step={1}
											min={auction.currentPrice + 1}
											id="bid-form-bid-field"
											disabled={isBiddingDisabled}
											aria-invalid={fieldState.invalid}
											inputMode="numeric"
											onChange={(e) => {
												setStatusMessage(null);
												field.onChange(Number(e.target.value));
											}}
											className="text-white border-gray-700 bg-gray-800/80 text-base font-semibold focus-visible:border-indigo-500 focus-visible:ring-indigo-500/30"
										/>
									</div>
									{fieldState.invalid && (
										<FieldError className="mt-1 text-xs text-red-400">
											{fieldState.error?.message}
										</FieldError>
									)}
								</Field>
							)}
						/>

						<Button
							type="submit"
							form="bid-form"
							disabled={isBiddingDisabled}
							className={cn(
								"mt-3 w-full font-semibold shadow-md transition-all cursor-pointer h-10",
								isSeller
									? "bg-gray-700 text-gray-400 cursor-not-allowed"
									: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25"
							)}
						>
							{isSubmitting ? (
								<span className="flex items-center gap-2">
									<HugeiconsIcon
										icon={Loading01Icon}
										className="size-4 animate-spin"
									/>
									<span>Gebot wird übermittelt...</span>
								</span>
							) : isSeller ? (
								"Eigene Auktion (Bieten deaktiviert)"
							) : isEnded ? (
								"Auktion beendet"
							) : watchedBid && !isNaN(Number(watchedBid)) && Number(watchedBid) > 0 ? (
								`Gebot von ${Number(watchedBid).toLocaleString("de-DE")} € abgeben`
							) : (
								"Gebot abgeben"
							)}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
};

"use client";

import { FC } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

interface SellerCardProps {
	sellerId: string;
	isSeller: boolean;
}

export const SellerCard: FC<SellerCardProps> = ({ sellerId, isSeller }) => {
	return (
		<div className="rounded-2xl border border-gray-800 bg-gray-900/90 p-5 shadow-xl backdrop-blur-md">
			<h3 className="font-semibold text-white border-b border-gray-800/80 pb-3 mb-4">
				Verkäuferinformationen
			</h3>

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30">
						<HugeiconsIcon icon={UserIcon} className="size-5" />
					</div>
					<div>
						<div className="flex items-center gap-1.5">
							<span className="text-sm font-semibold text-white">
								Verkäufer #{sellerId.slice(0, 8)}
							</span>
							<span title="Verifizierter Verkäufer">
								<HugeiconsIcon
									icon={CheckmarkCircle02Icon}
									className="size-4 text-emerald-400"
								/>
							</span>
						</div>
						<p className="text-xs text-gray-400 mt-0.5">
							ID: {sellerId}
						</p>
					</div>
				</div>

				{isSeller && (
					<span className="rounded-full bg-indigo-500/15 px-2.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
						Sie sind der Verkäufer
					</span>
				)}
			</div>
		</div>
	);
};

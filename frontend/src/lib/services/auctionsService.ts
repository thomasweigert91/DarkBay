import { cookies } from "next/headers";
import { Auction, GetAuctionsQuery, PaginatedAuctionsResponse } from "../types/auctions.types";

const API_BASE_URL = process.env.DARKBAY_API_URL || "http://localhost:8000";

export interface Offer {
	id: string;
	offer: number;
	offerDate: string;
	userId?: string;
}

export interface RequestOptions extends RequestInit {
	token?: string;
}

async function apiFetch<T>(
	endpoint: string,
	options: RequestOptions = {},
): Promise<T> {
	const { headers, ...restOptions } = options;

	const cookieStore = await cookies();
	const token = cookieStore.get("darkbay_token")?.value;

	const requestHeaders = new Headers(headers);
	requestHeaders.set("Content-Type", "application/json");

	if (token) {
		requestHeaders.set("Authorization", `Bearer ${token}`);
	}

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...restOptions,
		headers: requestHeaders,
		credentials: "include", // Unterstützt Better Auth Session-Cookies
	});

	if (!response.ok) {
		let errorMessage = `API Error ${response.status}: ${response.statusText}`;
		try {
			const errorBody = await response.json();
			if (errorBody && errorBody.message) {
				errorMessage = Array.isArray(errorBody.message)
					? errorBody.message.join(", ")
					: errorBody.message;
			}
		} catch {
			// Body war kein JSON
		}
		throw new Error(errorMessage);
	}

	if (response.status === 204) {
		return undefined as unknown as T;
	}

	return response.json() as Promise<T>;
}

export function getAuctions(query?: GetAuctionsQuery, options?: RequestOptions) {
	const params = new URLSearchParams();
	if (query) {
		Object.entries(query).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});
	}
	const queryString = params.toString();
	const endPoint = queryString ? `/auctions?${queryString}` : '/auctions';

	return apiFetch<PaginatedAuctionsResponse>(endPoint, {
		method: "GET",
		...options
	})
}

export function getAuctionById(id?: string, options?: RequestOptions) {

	const endPoint = `/auctions/${id}`;
	return apiFetch<Auction>(endPoint, {
		method: "GET",
		...options
	})
}
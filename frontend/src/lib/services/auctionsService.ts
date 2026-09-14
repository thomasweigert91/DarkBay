const API_BASE_URL = process.env.DARKBAY_API_URL || "http://localhost:8000";

export interface Offer {
  id: string;
  offer: number;
  offerDate: string;
  userId?: string;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  sellerId: string;
  startDate: string;
  endDate: string;
  offers?: Offer[];
}

export type AuctionStatus = "open" | "closed";

export interface GetAuctionsQuery {
  limit?: number;
  page?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: AuctionStatus;
}

export interface PaginatedAuctionsResponse {
  data: Auction[];
}

export interface RequestOptions extends RequestInit {
  token?: string;
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, headers, ...restOptions } = options;

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

export function getAuctions() {}

export function getAuctionById() {}

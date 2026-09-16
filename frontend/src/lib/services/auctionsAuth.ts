"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// our backend server 
const API_BASE_URL = process.env.DARKBAY_API_URL || "http://localhost:8000";

// key of cookie
const TOKEN_COOKIE_NAME = "darkbay_token";

export async function loginAction(formData: FormData) {
	const email = String(formData.get("email"));
	const password = String(formData.get("password"));

	const response = await fetch(`${API_BASE_URL}/api/auth/sign-in/email`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Origin": "http://localhost:3000",
		},
		body: JSON.stringify({ email, password }),
	});


	if (!response.ok) {
		const errorBody = await response.json().catch(() => null);
		console.log("Backend get an error:", errorBody);
		throw new Error(errorBody?.message || "Username or password not correct!");
	}

	const data = await response.json();
	const token = data.token;

	const cookieStore = await cookies();
	cookieStore.set(TOKEN_COOKIE_NAME, token, {
		httpOnly: true
	});

	redirect("/");
}

export async function registerAction(formData: FormData) {
	const name = String(formData.get("name"));
	const email = String(formData.get("email"));
	const password = String(formData.get("password"));

	try {
		const response = await fetch(`${API_BASE_URL}/api/auth/sign-up/email`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Origin": "http://localhost:3000"
			},
			body: JSON.stringify({ name, email, password }),

		});

		if (!response.ok) {
			const errBody: Error = await response.json().catch();
			console.log("Register Error:", errBody);
			throw new Error(errBody.message || "Registration failed");
		}

		const data = await response.json();

		if (data.token) {
			const cookieStore = await cookies();
			cookieStore.set(TOKEN_COOKIE_NAME, data.token, {
				httpOnly: true
			});

			redirect("/");
		}
	}

	catch (error) {
		console.log(error);
	}


}

export async function logoutAction() {
	const cookieStore = await cookies();
	cookieStore.delete(TOKEN_COOKIE_NAME);
	redirect("/login");
}

export async function isAuthenticated() {
	const cookieStore = await cookies();
	return cookieStore.has(TOKEN_COOKIE_NAME);
}

export interface UserSession {
	id: string;
	name: string;
	email: string;
	image?: string | null;
}

export async function getCurrentUser(): Promise<UserSession | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
	if (!token) return null;

	try {
		const response = await fetch(`${API_BASE_URL}/api/auth/get-session`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: "no-store",
		});

		if (!response.ok) return null;
		const data = await response.json();
		return data?.user || null;
	} catch (error) {
		console.error("getCurrentUser error:", error);
		return null;
	}
}

export async function createOfferAction(auctionId: string, offer: number) {
	const cookieStore = await cookies();
	const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

	if (!token) {
		throw new Error("Bitte melden Sie sich an, um ein Gebot abzugeben.");
	}

	const response = await fetch(`${API_BASE_URL}/auctions/${auctionId}/offers`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ offer }),
	});

	if (!response.ok) {
		const errorBody = await response.json().catch(() => null);
		const message = Array.isArray(errorBody?.message)
			? errorBody.message.join(", ")
			: errorBody?.message || `Fehler beim Bieten (${response.status})`;
		throw new Error(message);
	}

	return await response.json();
}
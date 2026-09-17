"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// our backend server
const API_BASE_URL = process.env.DARKBAY_API_URL || "http://localhost:8000";

// key of cookie
const TOKEN_COOKIE_NAME = "darkbay_token";

export type AuthState = {
  error?: string | null;
};

export async function loginAction(
  prevState: AuthState | FormData | null,
  formData?: FormData,
): Promise<AuthState> {
  const data = formData instanceof FormData ? formData : (prevState as FormData);
  const email = String(data?.get("email") || "").trim();
  const password = String(data?.get("password") || "");

  if (!email || !password) {
    return { error: "Bitte gib E-Mail und Passwort ein." };
  }

  let token: string | undefined;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let message = `Anmeldung fehlgeschlagen (${response.status})`;
      try {
        const errorBody = await response.json();
        message =
          errorBody?.message ||
          errorBody?.error ||
          (typeof errorBody === "string" ? errorBody : "E-Mail oder Passwort ist nicht korrekt.");
      } catch {
        const text = await response.text().catch(() => "");
        if (text) message = text;
      }
      console.log("Backend sign-in error:", response.status, message);
      return { error: message };
    }

    const resData = await response.json();
    token = resData?.token;
  } catch (err) {
    console.error("Login network/backend error:", err);
    return {
      error: "Verbindung zum Server fehlgeschlagen. Bitte versuche es erneut.",
    };
  }

  if (token) {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  redirect("/");
}

export async function registerAction(
  prevState: AuthState | FormData | null,
  formData?: FormData,
): Promise<AuthState> {
  const data = formData instanceof FormData ? formData : (prevState as FormData);
  const name = String(data?.get("name") || "").trim();
  const email = String(data?.get("email") || "").trim();
  const password = String(data?.get("password") || "");

  if (!name || !email || !password) {
    return { error: "Bitte alle Pflichtfelder ausfüllen." };
  }

  let token: string | undefined;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      let message = `Registrierung fehlgeschlagen (${response.status})`;
      try {
        const errBody = await response.json();
        message =
          errBody?.message ||
          errBody?.error ||
          (typeof errBody === "string" ? errBody : "Registrierung fehlgeschlagen.");
      } catch {
        const text = await response.text().catch(() => "");
        if (text) message = text;
      }
      console.log("Backend sign-up error:", response.status, message);
      return { error: message };
    }

    const resData = await response.json();
    token = resData?.token;
  } catch (err) {
    console.error("Register network/backend error:", err);
    return {
      error: "Verbindung zum Server fehlgeschlagen. Bitte versuche es erneut.",
    };
  }

  if (token) {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  redirect("/");
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

export interface CreateAuctionInput {
  title: string;
  description: string;
  startingPrice: number;
  endDate?: string;
}

export async function createAuctionAction(input: CreateAuctionInput) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    throw new Error("Bitte melden Sie sich an, um eine Auktion zu erstellen.");
  }

  if (!input.title || input.title.trim() === "") {
    throw new Error("Bitte geben Sie einen Titel für die Auktion ein.");
  }

  if (input.startingPrice === undefined || input.startingPrice < 1) {
    throw new Error("Der Startpreis muss mindestens 1 € betragen.");
  }

  const payload: Record<string, unknown> = {
    title: input.title.trim(),
    description: input.description?.trim() || "",
    startingPrice: Number(input.startingPrice),
  };

  if (input.endDate) {
    payload.endDate = new Date(input.endDate).toISOString();
  }

  const response = await fetch(`${API_BASE_URL}/auctions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = Array.isArray(errorBody?.message)
      ? errorBody.message.join(", ")
      : errorBody?.message ||
        `Fehler beim Erstellen der Auktion (${response.status})`;
    throw new Error(message);
  }

  const newAuction = await response.json();
  revalidatePath("/");
  revalidatePath("/auctions");
  return newAuction;
}

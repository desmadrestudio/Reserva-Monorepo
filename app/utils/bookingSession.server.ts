// app/utils/bookingSession.server.ts
import { createCookieSessionStorage, redirect, json } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET || "dev-secret";

export const bookingStorage = createCookieSessionStorage({
  cookie: {
    name: "__booking",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

type CartItem = {
  id: string;               // generated UUID client/server
  locationId: string;
  categoryId: string;
  serviceId: string;
  durationId: string;
  addonIds: string[];       // selected add-ons
  providerPreference?: "any" | "male" | "female";
  providerId?: string;      // if a specific therapist picked
  date?: string;            // ISO date (yyyy-mm-dd)
  time?: string;            // 'HH:mm'
};

export type BookingCart = {
  items: CartItem[];
};

const EMPTY: BookingCart = { items: [] };

export async function getBookingCart(request: Request): Promise<{cart: BookingCart; commit: (headers: Headers)=>Promise<void>}> {
  const session = await bookingStorage.getSession(request.headers.get("Cookie"));
  const cart = (session.get("cart") as BookingCart) ?? EMPTY;
  return {
    cart,
    commit: async (headers: Headers) => {
      session.set("cart", cart);
      headers.append("Set-Cookie", await bookingStorage.commitSession(session));
    }
  };
}

export async function mutateCart(request: Request, mutate: (cart: BookingCart)=>void) {
  const session = await bookingStorage.getSession(request.headers.get("Cookie"));
  const cart = (session.get("cart") as BookingCart) ?? { items: [] };
  mutate(cart);
  session.set("cart", cart);
  return redirect("/booking/review", {
    headers: {
      "Set-Cookie": await bookingStorage.commitSession(session),
    },
  });
}
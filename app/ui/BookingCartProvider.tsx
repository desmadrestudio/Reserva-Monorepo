import { createContext, useContext, useState } from "react";

export interface BookingItem {
  id: string | number;
  serviceId: string | number;
  title: string;
  size: string;
  staff: string;
  gender: string;
  addons: string[];
  time: string;
  date: string;
}

interface BookingCartContextType {
  bookings: BookingItem[];
  addBooking: (item: BookingItem) => void;
  removeBooking: (id: BookingItem["id"]) => void;
  clearCart: () => void;
  getBookings: () => BookingItem[];
}

const BookingCartContext = createContext<BookingCartContextType | undefined>(
  undefined
);

export function BookingCartProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<BookingItem[]>([]);

  const addBooking = (item: BookingItem) => {
    setBookings((prev) => [...prev, item]);
  };

  const removeBooking = (id: BookingItem["id"]) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
  };

  const clearCart = () => {
    setBookings([]);
  };

  const getBookings = () => bookings;

  return (
    <BookingCartContext.Provider
      value={{ bookings, addBooking, removeBooking, clearCart, getBookings }}
    >
      {children}
    </BookingCartContext.Provider>
  );
}

export function useBookingCart() {
  const context = useContext(BookingCartContext);
  if (context === undefined) {
    throw new Error("useBookingCart must be used within a BookingCartProvider");
  }
  return context;
}

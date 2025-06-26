// /app/config/booking.ts

export const providers = [
    { label: "Staff A", value: "Staff A" },
    { label: "Staff B", value: "Staff B" },
    // Extend dynamically later from DB
];

export const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

export const services = [
    { label: "Consultation", value: "Consultation" },
    { label: "Follow-up", value: "Follow-up" },
    { label: "Custom Session", value: "Custom Session" },
    // Add more services as needed
];

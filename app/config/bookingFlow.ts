// Defines the order of pages used during the booking process.
// Each step corresponds to a route component named `booking.<step>.tsx`.
// When a customer adds another service, the flow should start over from
// the first step to collect the new details.
export const BOOKING_FLOW = [
  "location",
  "category",
  "service",
  "size",
  "addons",
  "staff",
  "gender",
  "datetime",
  "confirm",
] as const;

// The step index to return to when adding an additional service
export const BOOKING_LOOP_START_INDEX = 0;

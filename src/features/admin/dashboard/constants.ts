import type { Payment_Method } from "@/generated/prisma/enums";

export const PAYMENTS = [
  { key: "all" as const, label: "All" },
  { key: "CASH" as const, label: "Cash" },
  { key: "GCASH" as const, label: "GCash" },
  { key: "GRAB" as const, label: "Grab" },
] as const;

export type PaymentMethodFilter = (typeof PAYMENTS)[number]["key"];

export type PaymentMethodKey = Payment_Method;

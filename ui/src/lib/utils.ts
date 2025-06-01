import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .map((w) => {
      return w[0].toUpperCase();
    })
    .join("")
    .substring(0, 2);
}

export const formatCurrency = (amount: string) => {
  amount = amount.replace(".", "").replace(",", "").replace(/\D/g, "");
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(parseFloat(amount) / 100);
};

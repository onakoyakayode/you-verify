import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  const [main, decimal] = formatted.split(".");

  return (
    <>
      ${main}
      <span className="text-xs text-gray-500">.{decimal}</span>
    </>
  );
}

export function formatDate(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
}

export function formatNumber(num) {
  return new Intl.NumberFormat("en-US").format(num);
}

export function getStatusColor(status) {
  switch (status) {
    case "paid":
      return "text-green-600";
    case "sent":
      return "text-blue-600";
    case "overdue":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
}

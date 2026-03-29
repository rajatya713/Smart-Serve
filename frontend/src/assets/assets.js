import close_icon from "./close.png";
import menu_icon from "./menu.png";

export { close_icon, menu_icon };

export const menuLinks = [
  { name: "Home", id: "hero" },
  { name: "About", id: "about" },
  { name: "Services", id: "services" },
  { name: "Contact", id: "contact" },
];

export const vehicleTypes = ["Car", "Bike", "SUV", "Scooter", "Van"];

export const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  assigned: "bg-indigo-100 text-indigo-700",
  "picked-up": "bg-cyan-100 text-cyan-700",
  "in-transit": "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export const paymentColors = {
  unpaid: "bg-orange-100 text-orange-600",
  paid: "bg-green-100 text-green-700",
  refunded: "bg-gray-100 text-gray-600",
};

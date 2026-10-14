import { useCart } from "../state/cart";
export function CheckoutPage() { return useCart((s) => s.items.length); }

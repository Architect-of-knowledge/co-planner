import { useCart } from "../state/cart";
export function CartPage() { useCart.setState({ items: [] }); return null; }

import { Product } from "@/lib/supabase/types";
import { selectProductHeroImage } from "@/lib/product-image-presentation";

export interface CartItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

const CART_KEY = "perle-cart";

export function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function storeCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function productToCartItem(
  product: Product,
  quantity: number = 1,
): CartItem {
  const primaryImage = selectProductHeroImage(product) ?? "";

  return {
    product_id: product.id,
    title: product.title,
    price: product.price,
    quantity,
    image: primaryImage,
    slug: product.slug,
  };
}

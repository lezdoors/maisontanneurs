export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  images: string[];
  category: string;
  dimensions: Record<string, string>;
  weight_lbs: number | null;
  materials: string[];
  craftsman_id: string | null;
  available_quantity: number;
  status: "available" | "sold" | "reserved" | "draft";
  featured: boolean;
  created_at: string;
  updated_at: string;
  craftsmen?: Craftsman;
}

export interface Order {
  id: string;
  order_number: string;
  sales_channel: "direct" | "etsy";
  revolut_order_id: string | null;
  stripe_session_id: string | null;
  etsy_order_id: string | null;
  customer_email: string;
  customer_name: string;
  shipping_address: Record<string, string>;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  currency: string; // ISO 4217 — the currency the customer was charged in
  status: "pending" | "paid" | "shipped" | "delivered";
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Craftsman {
  id: string;
  name: string;
  location: string;
  specialty: string | null;
  bio: string | null;
  contact_info: Record<string, string>;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "viewer";
  created_at: string;
}

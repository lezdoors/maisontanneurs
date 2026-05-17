import { Product } from "@/lib/supabase/types";

export const STATIC_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Atlas Caravan Tee",
    slug: "atlas-caravan-tee",
    price: 6500,
    images: [
      "/products/drop-01/atlas-caravan-tee-01.svg",
      "/products/drop-01/atlas-caravan-tee-02.svg",
    ],
    category: "Tees",
    status: "available",
    featured: true,
    materials: ["Heavyweight cotton", "Hand-finished print"],
    dimensions: { fit: "Boxy oversized" },
    description:
      "Heavyweight cotton tee carrying a painterly figurative graphic from the Drop 01 art collection. Box-cut, cream base, print edge to edge.",
    available_quantity: 100,
    weight_lbs: 1,
    craftsman_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    title: "Onyx Caravan Hoodie",
    slug: "onyx-caravan-hoodie",
    price: 13000,
    images: [
      "/products/drop-01/onyx-caravan-hoodie-01.svg",
      "/products/drop-01/onyx-caravan-hoodie-02.svg",
    ],
    category: "Hoodies",
    status: "available",
    featured: true,
    materials: ["Mid-weight cotton fleece", "Hand-finished print"],
    dimensions: { fit: "Oversized" },
    description:
      "Mid-weight cotton fleece hoodie with full-back painterly graphic. Black ground, edge-to-edge print, dropped shoulder.",
    available_quantity: 80,
    weight_lbs: 2,
    craftsman_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    title: "Atlas Lion Cap",
    slug: "atlas-lion-cap",
    price: 4500,
    images: [
      "/products/drop-01/atlas-lion-cap-01.svg",
    ],
    category: "Caps",
    status: "available",
    featured: true,
    materials: ["Brushed cotton twill", "Embroidered front"],
    dimensions: { fit: "Five-panel, adjustable" },
    description:
      "Brushed cotton five-panel cap with an embroidered Atlas Lion silhouette at the front. Black on black, low profile.",
    available_quantity: 150,
    weight_lbs: 0.5,
    craftsman_id: null,
    created_at: "",
    updated_at: "",
  },
];

export const CATEGORIES = [
  "All",
  "Tees",
  "Hoodies",
  "Caps",
  "Scarves",
  "Outerwear",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const LIGHTING_DB_CATEGORIES = [] as const;

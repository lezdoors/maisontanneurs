import { Product } from "@/lib/supabase/types";

export const STATIC_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Heritage Rucksack",
    slug: "heritage-rucksack",
    price: 32500,
    images: [
      "/products/drop-01/heritage-rucksack-01-v2.webp",
      "/products/drop-01/heritage-rucksack-02-v2.webp",
      "/products/drop-01/heritage-rucksack-03.webp",
    ],
    category: "Leather Goods",
    status: "available",
    featured: true,
    materials: [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-stitched in Marrakech",
    ],
    dimensions: { size: "45cm × 32cm × 18cm · multi-pocket" },
    description:
      "Full-grain cognac leather rucksack with three buckled exterior pockets and a roll-top main compartment. Hand-stitched and brass-fitted by Marrakech leather artisans. Patinas with wear.",
    available_quantity: 30,
    weight_lbs: 3,
    craftsman_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    title: "Roll-Top Daypack",
    slug: "rolltop-daypack",
    price: 24500,
    images: [
      "/products/drop-01/rolltop-daypack-01.webp",
      "/products/drop-01/rolltop-daypack-02.webp",
      "/products/drop-01/rolltop-daypack-03.webp",
    ],
    category: "Leather Goods",
    status: "available",
    featured: true,
    materials: [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-stitched in Marrakech",
    ],
    dimensions: { size: "42cm × 30cm × 14cm · single-pocket" },
    description:
      "Cleaner cousin to the Heritage Rucksack. Single front pocket, X-strap closure, soft Moroccan tan leather that softens into the body with use. Built for daily carry.",
    available_quantity: 30,
    weight_lbs: 2.5,
    craftsman_id: null,
    created_at: "",
    updated_at: "",
  },
];

export const CATEGORIES = ["All", "Leather Goods"] as const;

export type Category = (typeof CATEGORIES)[number];

export const LIGHTING_DB_CATEGORIES = [] as const;

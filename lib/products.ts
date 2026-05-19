import { Product } from "@/lib/supabase/types";

export const STATIC_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Wordmark Cotton Tee",
    slug: "wordmark-cotton-tee",
    price: 8500,
    images: [
      "/products/drop-01/wordmark-tee-01.webp",
      "/products/drop-01/wordmark-tee-02.svg",
    ],
    category: "Streetwear",
    status: "available",
    featured: true,
    materials: ["Heavyweight cotton", "240 gsm", "Made-to-order print"],
    dimensions: { fit: "Oversized boxy" },
    description:
      "Heavyweight cotton tee with a single Kechken wordmark in bronze foil at the chest. Cut oversized, dropped shoulder, bone-colored heavyweight jersey.",
    available_quantity: 100,
    weight_lbs: 1,
    craftsman_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    title: "Heritage Hoodie",
    slug: "heritage-hoodie",
    price: 16500,
    images: [
      "/products/drop-01/heritage-hoodie-01-v2.webp",
      "/products/drop-01/heritage-hoodie-02.svg",
    ],
    category: "Streetwear",
    status: "available",
    featured: true,
    materials: ["Cotton fleece", "Embroidered heritage patch", "Brushed interior"],
    dimensions: { fit: "Oversized" },
    description:
      "Mid-weight brushed cotton fleece in deep charcoal. Small embroidered Atlas-line patch at the chest in burnished bronze thread.",
    available_quantity: 80,
    weight_lbs: 2,
    craftsman_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    title: "Atlas Line Pendant",
    slug: "atlas-line-pendant",
    price: 18500,
    images: [
      "/products/drop-01/atlas-pendant-01.svg",
      "/products/drop-01/atlas-pendant-02.svg",
    ],
    category: "Jewelry",
    status: "available",
    featured: true,
    materials: ["Sterling silver", "Hand-finished", "Adjustable chain"],
    dimensions: { size: "32mm pendant on 50cm chain" },
    description:
      "An abstract line silhouette of the Atlas Mountains, cast in sterling silver and hand-finished. Worn long, sits against the sternum.",
    available_quantity: 40,
    weight_lbs: 0.5,
    craftsman_id: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
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
    id: "5",
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

export const CATEGORIES = [
  "All",
  "Streetwear",
  "Leather Goods",
  "Jewelry",
  "Limited Drops",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const LIGHTING_DB_CATEGORIES = [] as const;

// Run with: npx tsx scripts/seed-products.ts
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

async function seed() {
  // Seed craftsmen
  const { data: craftsmen } = await supabase
    .from("craftsmen")
    .insert([
      {
        name: "Hassan Amrani",
        location: "Marrakech Medina",
        specialty: "Mother-of-Pearl Inlay",
        bio: "Third-generation master craftsman specializing in intricate mother-of-pearl and bone inlay work. Hassan learned the art from his father, who learned from his father before him.",
      },
      {
        name: "Youssef Benali",
        location: "Marrakech",
        specialty: "Wood Carving & Marquetry",
        bio: "Known for geometric cedar and walnut marquetry patterns inspired by Islamic geometric art. Over 25 years of experience crafting one-of-a-kind pieces.",
      },
      {
        name: "Karim Essaidi",
        location: "Marrakech Medina",
        specialty: "Brass & Metalwork",
        bio: "Master metalsmith creating hand-hammered brass lanterns, tables, and decorative pieces using techniques passed down through generations.",
      },
    ])
    .select();

  console.log("Seeded craftsmen:", craftsmen?.length);

  // Seed products
  const products = [
    {
      title: "Octagonal Mirror Table",
      slug: "octagonal-mirror-table",
      description:
        "A stunning octagonal table featuring hand-hammered brass and mirror mosaic work. The geometric base draws from traditional Moroccan architectural motifs, while the mirrored top surface catches and reflects light throughout the room.",
      price: 289900,
      images: ["/products/octagonal-table.png"],
      category: "Tables",
      dimensions: { width: "24in", depth: "24in", height: "18in" },
      weight_lbs: 45,
      materials: ["Brass", "Mirror", "Cedar"],
      craftsman_id: craftsmen?.[2]?.id,
      available_quantity: 1,
      featured: true,
    },
    {
      title: "Bone Inlay Side Tables",
      slug: "bone-inlay-side-tables",
      description:
        "A set of three nesting octagonal tables with geometric bone inlay patterns. Each table features hand-cut bone pieces arranged in traditional Islamic geometric designs against a dark resin background.",
      price: 149900,
      images: ["/products/bone-inlay-tables.png"],
      category: "Tables",
      dimensions: { width: "14in", depth: "14in", height: "22in" },
      weight_lbs: 30,
      materials: ["Bone", "Resin", "Wood"],
      craftsman_id: craftsmen?.[0]?.id,
      available_quantity: 1,
      featured: true,
    },
    {
      title: "Royal Seating Collection",
      slug: "royal-seating-collection",
      description:
        "Complete traditional Moroccan seating set with hand-carved walnut frame, mother-of-pearl inlay, and rich blue velvet cushions. This collection transforms any space into an opulent Moroccan salon.",
      price: 499900,
      images: ["/products/seating-set.png"],
      category: "Seating",
      dimensions: { width: "120in", depth: "36in", height: "42in" },
      weight_lbs: 200,
      materials: ["Walnut", "Velvet", "Mother-of-Pearl"],
      craftsman_id: craftsmen?.[0]?.id,
      available_quantity: 1,
      featured: true,
    },
    {
      title: "Zellige Mirror Frame",
      slug: "zellige-mirror-frame",
      description:
        "Hand-cut zellige tile mosaic surrounding a beveled mirror. Each tiny tile is individually shaped and placed, creating a mesmerizing geometric pattern that frames your reflection.",
      price: 89900,
      images: ["/products/product-04.png"],
      category: "Mirrors",
      dimensions: { width: "36in", depth: "2in", height: "48in" },
      weight_lbs: 25,
      materials: ["Zellige Tile", "Cedar"],
      craftsman_id: craftsmen?.[1]?.id,
      available_quantity: 1,
      featured: false,
    },
    {
      title: "Brass Pendant Light",
      slug: "brass-pendant-light",
      description:
        "Pierced brass pendant light that casts intricate shadow patterns across walls and ceilings. Each perforation is hand-punched, creating a constellation of light points.",
      price: 67900,
      images: ["/products/product-05.png"],
      category: "Lighting",
      dimensions: { width: "18in", depth: "18in", height: "24in" },
      weight_lbs: 8,
      materials: ["Brass", "Glass"],
      craftsman_id: craftsmen?.[2]?.id,
      available_quantity: 1,
      featured: false,
    },
    {
      title: "Cedar Carved Panel",
      slug: "cedar-carved-panel",
      description:
        "Hand-carved cedar wall panel featuring arabesque motifs in deep relief. The natural cedar aroma adds a sensory dimension to its visual beauty.",
      price: 129900,
      images: ["/products/product-06.png"],
      category: "Decor",
      dimensions: { width: "48in", depth: "2in", height: "36in" },
      weight_lbs: 15,
      materials: ["Cedar"],
      craftsman_id: craftsmen?.[1]?.id,
      available_quantity: 1,
      featured: false,
    },
    {
      title: "Marquetry Console Table",
      slug: "marquetry-console-table",
      description:
        "Geometric marquetry console with contrasting walnut and lemon wood inlays. A statement piece for entryways and hallways.",
      price: 349900,
      images: ["/products/product-07.png"],
      category: "Tables",
      dimensions: { width: "48in", depth: "16in", height: "32in" },
      weight_lbs: 55,
      materials: ["Walnut", "Lemon Wood", "Bone"],
      craftsman_id: craftsmen?.[1]?.id,
      available_quantity: 1,
      featured: false,
    },
    {
      title: "Carved Wooden Screen",
      slug: "carved-wooden-screen",
      description:
        "Three-panel carved cedar room divider with iron hinges. Each panel features a different traditional geometric pattern, working together as a unified composition.",
      price: 199900,
      images: ["/products/product-08.png"],
      category: "Decor",
      dimensions: { width: "72in", depth: "1in", height: "72in" },
      weight_lbs: 40,
      materials: ["Cedar", "Iron"],
      craftsman_id: craftsmen?.[1]?.id,
      available_quantity: 1,
      featured: false,
    },
  ];

  const { data: insertedProducts, error } = await supabase
    .from("products")
    .insert(products)
    .select();

  if (error) {
    console.error("Error seeding products:", error);
  } else {
    console.log("Seeded products:", insertedProducts?.length);
  }
}

seed().then(() => {
  console.log("Seed complete");
  process.exit(0);
});

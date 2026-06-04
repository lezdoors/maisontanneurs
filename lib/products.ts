import { Product } from "@/lib/supabase/types";

// Offline/static fallback for local QA, feeds, and checkout validation when
// Supabase environment variables are absent. This mirrors the visible live
// storefront catalogue scraped from maisontanneurs.com on 2026-05-28.
//
// Production listings still come from Supabase. Do not add draft/test SKUs
// here unless they should be visible in local storefront fallback mode.

export const STATIC_PRODUCTS: Product[] = [
  {
    "id": "static-01-atlas-briefcase-vintage",
    "title": "Atlas Briefcase · Vintage",
    "slug": "atlas-briefcase-vintage",
    "price": 38500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-briefcase-vintage-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-briefcase-vintage-scale.webp"
    ],
    "category": "Briefcase",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Vintage-register briefcase in deep cognac leather. Dual buckle closures, sturdy top handle, removable crossbody strap. Designed for daily commute with documents and a 14\" laptop.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-atlas-field-briefcase",
    "title": "Atlas Field Briefcase",
    "slug": "atlas-field-briefcase",
    "price": 38500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-field-briefcase-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-field-briefcase-pdp-01.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-field-briefcase-pdp-02.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-field-briefcase-pdp-03.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-field-briefcase-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-field-briefcase-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-field-briefcase-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-field-briefcase-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-field-briefcase-pdp-09.webp"
    ],
    "category": "Briefcase",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Utility briefcase in full-grain cognac leather with a wide flap, side buckle straps, twin front pockets, and a stitched top handle. Built for documents, travel, and daily carry with field-bag practicality.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-02-atlas-kilim-duffle",
    "title": "Atlas Kilim Duffle",
    "slug": "atlas-kilim-duffle",
    "price": 44500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-duffle-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-duffle-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-duffle-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-duffle-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-duffle-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-duffle-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-duffle-pdp-09.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-duffle-pdp-01.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-duffle-pdp-02.webp"
    ],
    "category": "Duffle",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Handwoven Atlas kilim wool panels",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Travel weekender in saddle cognac leather framing handwoven kilim wool panels sourced from Atlas weavers. Brass middle strap, dual rolled handles. The signature Morocco-meets-luxury anchor of the maison.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-03-atlas-kilim-rucksack",
    "title": "Atlas Kilim Rucksack",
    "slug": "atlas-kilim-rucksack",
    "price": 39500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-rucksack-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-rucksack-scale.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-rucksack-pdp-01.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-rucksack-pdp-02.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-rucksack-pdp-03.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-rucksack-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-rucksack-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-rucksack-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-rucksack-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-rucksack-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-kilim-rucksack-pdp-09.webp"
    ],
    "category": "Backpack",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Handwoven Atlas kilim wool panels",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Rucksack rendered in saddle cognac leather framing handwoven kilim wool panels from Atlas weavers. The sister silhouette to the Kilim Duffle, shoulder-carry register.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-04-atlas-messenger-laptop",
    "title": "Atlas Messenger · Laptop",
    "slug": "atlas-messenger-laptop",
    "price": 32500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-messenger-laptop-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-messenger-laptop-scale.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-messenger-laptop-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-messenger-laptop-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-messenger-laptop-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-messenger-laptop-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-messenger-laptop-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-messenger-laptop-pdp-01.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-messenger-laptop-pdp-02.webp"
    ],
    "category": "Messenger",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Modern messenger in burnished cognac leather. Padded 14\" laptop sleeve, brass-finished hardware, flap closure with internal magnetic snaps. Daily commute, decade of patina.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-05-atlas-weekender-cognac",
    "title": "Atlas Weekender · Cognac",
    "slug": "atlas-weekender-cognac",
    "price": 32500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-weekender-cognac-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-weekender-cognac-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-weekender-cognac-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-weekender-cognac-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-weekender-cognac-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-weekender-cognac-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-weekender-cognac-pdp-01.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-weekender-cognac-pdp-02.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/atlas-weekender-cognac-pdp-03.webp"
    ],
    "category": "Weekender",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass zipper and hardware",
      "Dual rolled leather handles",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Soft slouchy cognac leather weekender with double rolled handles and side slip pocket. Patinas warmer with every trip. Brass zip, lined interior.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-07-classic-cognac-satchel",
    "title": "Classic Cognac Satchel",
    "slug": "classic-cognac-satchel",
    "price": 28500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/classic-cognac-satchel-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/classic-cognac-satchel-pdp-02.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/classic-cognac-satchel-pdp-03.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/classic-cognac-satchel-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/classic-cognac-satchel-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/classic-cognac-satchel-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/classic-cognac-satchel-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/classic-cognac-satchel-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/classic-cognac-satchel-pdp-09.webp"
    ],
    "category": "Satchel",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Classic briefcase satchel in rich cognac full-grain leather. Dual brass buckle closures, sturdy top handle plus removable crossbody strap. Cream saddle-stitch edges throughout. Carries a 14\" laptop. Heirloom-grade.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-08-cognac-brogue-backpack",
    "title": "Cognac Brogue Backpack",
    "slug": "cognac-brogue-backpack",
    "price": 26500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/cognac-brogue-backpack-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/cognac-brogue-backpack-pdp-02.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/cognac-brogue-backpack-pdp-03.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/cognac-brogue-backpack-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/cognac-brogue-backpack-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/cognac-brogue-backpack-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/cognac-brogue-backpack-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/cognac-brogue-backpack-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/cognac-brogue-backpack-pdp-09.webp"
    ],
    "category": "Backpack",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Structured cognac full-grain leather backpack with dual zip compartments, compact front pocket, leather pullers, and adjustable shoulder straps. A practical city piece with warm pull-up character and hand-finished edges.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-09-expedition-rolltop-cognac",
    "title": "Expedition Rolltop · Cognac",
    "slug": "expedition-rolltop-cognac",
    "price": 29500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-cognac-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-cognac-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-cognac-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-cognac-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-cognac-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-cognac-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-cognac-pdp-01.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-cognac-pdp-02.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-cognac-pdp-03.webp"
    ],
    "category": "Rolltop",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Cognac full-grain leather rolltop expedition pack with vertical X-strap closure. Vegetable-tanned in Marrakech, brass tri-glide buckles, internal padded sleeve. Built for daily carry and long miles.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-10-expedition-rolltop-noir",
    "title": "Expedition Rolltop · Noir",
    "slug": "expedition-rolltop-noir",
    "price": 29500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-noir-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-noir-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-noir-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-noir-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-noir-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-noir-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-noir-pdp-01.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-noir-pdp-02.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/expedition-rolltop-noir-pdp-03.webp"
    ],
    "category": "Rolltop",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Same expedition silhouette in deep noir leather. Vegetable-tanned, X-strap closure, brass tri-glides, internal padded sleeve. A quieter cut of the cognac.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-11-explorer-rolltop-cognac",
    "title": "Explorer Rolltop · Cognac",
    "slug": "explorer-rolltop-cognac",
    "price": 28500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/explorer-rolltop-cognac-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/explorer-rolltop-cognac-scale.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/explorer-rolltop-cognac-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/explorer-rolltop-cognac-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/explorer-rolltop-cognac-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/explorer-rolltop-cognac-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/explorer-rolltop-cognac-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/explorer-rolltop-cognac-pdp-09.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/explorer-rolltop-cognac-pdp-01.webp"
    ],
    "category": "Rolltop",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Modern rolltop rucksack in deep saddle cognac. Brass center buckle closes a full-bleed roll-down panel; a brass zip pocket runs the vertical centerline. Patinas warm and softens at the corners with daily carry.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-12-heritage-rucksack",
    "title": "Heritage Rucksack",
    "slug": "heritage-rucksack",
    "price": 32500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/heritage-rucksack-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-01/heritage-rucksack-scale.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/heritage-rucksack-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/heritage-rucksack-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/heritage-rucksack-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/heritage-rucksack-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/heritage-rucksack-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/heritage-rucksack-pdp-09.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/heritage-rucksack-pdp-01.webp"
    ],
    "category": "Backpack",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Full-grain cognac leather rucksack with three buckled exterior pockets and a roll-top main compartment. Hand-stitched and brass-fitted by Marrakech leather artisans. Patinas with wear.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-13-marrakech-tote-cognac",
    "title": "Marrakech Tote · Cognac",
    "slug": "marrakech-tote-cognac",
    "price": 29500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/marrakech-tote-cognac-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/marrakech-tote-cognac-scale.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/marrakech-tote-cognac-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/marrakech-tote-cognac-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/marrakech-tote-cognac-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/marrakech-tote-cognac-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/marrakech-tote-cognac-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/marrakech-tote-cognac-pdp-01.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/marrakech-tote-cognac-pdp-02.webp"
    ],
    "category": "Tote",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Structured open-top tote in deep cognac full-grain leather. Tall handles for shoulder carry, magnetic snap interior, brass-finished hardware. Patinas warmer with every season.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-marrakech-tote-bordeaux",
    "title": "Marrakech Tote · Bordeaux",
    "slug": "marrakech-tote-bordeaux",
    "price": 29500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/marrakech-tote-bordeaux-pdp-white.webp"
    ],
    "category": "Tote",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid antique brass hardware",
      "Open-top with internal magnetic snap",
      "Hand saddle-stitched in Marrakech"
    ],
    "dimensions": {
      "size": "38cm × 34cm × 14cm · open top"
    },
    "description": "Structured open-top tote in rich bordeaux full-grain leather. Tall handles for shoulder carry, magnetic snap interior, brass-finished hardware. Deepens to a wine-cordovan tone with wear.",
    "available_quantity": 18,
    "weight_lbs": 2.5,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-marrakech-tote-noir",
    "title": "Marrakech Tote · Noir",
    "slug": "marrakech-tote-noir",
    "price": 29500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/marrakech-tote-noir-pdp-white.webp"
    ],
    "category": "Tote",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Cream contrast zigzag stitching",
      "Solid antique brass hardware",
      "Open-top with internal magnetic snap",
      "Hand saddle-stitched in Marrakech"
    ],
    "dimensions": {
      "size": "38cm × 34cm × 14cm · open top, zigzag stitch"
    },
    "description": "Structured open-top tote in deep noir leather, framed by a cream zigzag stitch border. Tall handles for shoulder carry, magnetic snap interior, brass-finished hardware.",
    "available_quantity": 18,
    "weight_lbs": 2.5,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-14-medina-crossbody-cognac",
    "title": "Medina Crossbody · Cognac",
    "slug": "medina-crossbody-cognac",
    "price": 19500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-cognac-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-cognac-scale.webp"
    ],
    "category": "Crossbody",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Clean flap crossbody in saddle cognac leather. Single brass turn-lock, adjustable shoulder strap, off-white contrast stitching. The medina line's daily silhouette.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-medina-crossbody-tassel",
    "title": "Medina Crossbody · Tassel",
    "slug": "medina-crossbody-tassel",
    "price": 19500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-tassel-pdp-white.webp"
    ],
    "category": "Crossbody",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid antique brass turn-lock",
      "Hand-finished leather tassel",
      "Adjustable shoulder strap",
      "Hand saddle-stitched in Marrakech"
    ],
    "dimensions": {
      "size": "22cm × 18cm × 6cm · tassel detail"
    },
    "description": "Flap crossbody in saddle cognac leather, finished with a hand-twisted leather tassel at the turn-lock. A small artisan flourish, brass-finished hardware, daily-carry sized.",
    "available_quantity": 22,
    "weight_lbs": 0.8,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-15-medina-crossbody-envelope",
    "title": "Medina Envelope Crossbody",
    "slug": "medina-crossbody-envelope",
    "price": 18500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-envelope-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-envelope-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-envelope-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-envelope-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-envelope-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-envelope-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-envelope-pdp-09.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-envelope-pdp-01.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-envelope-pdp-02.webp"
    ],
    "category": "Crossbody",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Compact envelope crossbody in deep walnut leather, finished with a single brass turn-lock and an adjustable saddle strap. Quiet enough for evening, structured enough for daily carry.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-16-medina-crossbody-tooled-walnut",
    "title": "Medina Crossbody · Tooled Walnut",
    "slug": "medina-crossbody-tooled-walnut",
    "price": 24500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-tooled-walnut-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-tooled-walnut-scale.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-tooled-walnut-macro-01.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-tooled-walnut-macro-02.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-crossbody-tooled-walnut-macro-03.webp"
    ],
    "category": "Crossbody",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Hand-tooled leather flap",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Hand-tooled saddle crossbody in deep walnut leather. The diamond-and-floral motif is carved by hand into the flap — every piece slightly different. Brass turn-lock, off-white contrast stitching.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-17-medina-duffle",
    "title": "Medina Duffle",
    "slug": "medina-duffle",
    "price": 36500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-duffle-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-duffle-scale.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-duffle-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-duffle-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-duffle-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-duffle-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-duffle-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-duffle-pdp-01.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-duffle-pdp-02.webp"
    ],
    "category": "Duffle",
    "status": "reserved",
    "featured": false,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass zipper and hardware",
      "Dual rolled leather handles",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Travel weekender in burnished cognac leather. Brass middle strap buckle, dual rolled handles, removable saddle shoulder strap. A weekend bag the next generation inherits.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-18-medina-rucksack-drawstring",
    "title": "Medina Drawstring Rucksack",
    "slug": "medina-rucksack-drawstring",
    "price": 25500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-drawstring-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-drawstring-scale.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-drawstring-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-drawstring-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-drawstring-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-drawstring-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-drawstring-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-drawstring-pdp-09.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-drawstring-pdp-01.webp"
    ],
    "category": "Backpack",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Tall cognac drawstring rucksack with a single front buckled pocket and adjustable shoulder strap. A sailor's silhouette translated to luxury full-grain Moroccan leather. Patinas richer with each season.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-19-medina-rucksack-flap-chocolate",
    "title": "Medina Rucksack · Flap Chocolate",
    "slug": "medina-rucksack-flap-chocolate",
    "price": 28500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-flap-chocolate-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-flap-chocolate-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-flap-chocolate-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-flap-chocolate-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-flap-chocolate-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-flap-chocolate-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-flap-chocolate-pdp-01.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-flap-chocolate-pdp-02.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-rucksack-flap-chocolate-pdp-03.webp"
    ],
    "category": "Backpack",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Chocolate full-grain leather drawstring rucksack with overflap and two front buckled pockets. Brass tri-glides, hand-burnished edges. The everyday quietly-luxurious carry.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-20-medina-saddlebag-tooled-cognac",
    "title": "Medina Saddlebag · Tooled Cognac",
    "slug": "medina-saddlebag-tooled-cognac",
    "price": 26500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-saddlebag-tooled-cognac-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-saddlebag-tooled-cognac-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-saddlebag-tooled-cognac-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-saddlebag-tooled-cognac-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-saddlebag-tooled-cognac-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-saddlebag-tooled-cognac-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-saddlebag-tooled-cognac-pdp-01.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-saddlebag-tooled-cognac-pdp-02.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/medina-saddlebag-tooled-cognac-pdp-03.webp"
    ],
    "category": "Saddlebag",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Hand-tooled leather flap",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Cognac full-grain saddle bag with hand-tooled diamond and rosette flap. Brass turn-lock closure, adjustable shoulder strap. Each flap is carved by hand — every piece is one of one.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-21-oasis-weekender-oxblood",
    "title": "Oasis Weekender · Oxblood",
    "slug": "oasis-weekender-oxblood",
    "price": 34500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/oasis-weekender-oxblood-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/oasis-weekender-oxblood-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/oasis-weekender-oxblood-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/oasis-weekender-oxblood-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/oasis-weekender-oxblood-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/oasis-weekender-oxblood-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/oasis-weekender-oxblood-pdp-01.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/oasis-weekender-oxblood-pdp-02.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/oasis-weekender-oxblood-pdp-03.webp"
    ],
    "category": "Weekender",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass zipper and hardware",
      "Dual rolled leather handles",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Structured deep-oxblood leather weekender with contrast hide side panel and double rolled handles. Brass hardware, hand-stitched gusset, slip pocket interior. Made for a long Friday night.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-22-vintage-buckle-backpack",
    "title": "Vintage Buckle Backpack",
    "slug": "vintage-buckle-backpack",
    "price": 22500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/vintage-buckle-backpack-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/vintage-buckle-backpack-scale.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/vintage-buckle-backpack-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/vintage-buckle-backpack-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/vintage-buckle-backpack-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/vintage-buckle-backpack-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/vintage-buckle-backpack-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/vintage-buckle-backpack-pdp-09.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/vintage-buckle-backpack-pdp-01.webp"
    ],
    "category": "Backpack",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Safari-classic silhouette in cognac full-grain leather. Buckled flap over a drawstring inner closure, plus three exterior buckled pockets (one front, two side). Patinas to a deep tobacco with daily wear.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-23-vintage-satchel-light-brown",
    "title": "Vintage Satchel · Light Brown",
    "slug": "vintage-satchel-light-brown",
    "price": 21500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/vintage-satchel-light-brown-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/vintage-satchel-light-brown-scale.webp"
    ],
    "category": "Satchel",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Compact satchel in soft light-brown full-grain leather. Buckled flap closure, brass-finished hardware, adjustable crossbody strap. The everyday companion that patinas warm with use.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  },
  {
    "id": "static-24-woven-leather-backpack",
    "title": "Woven Leather Backpack",
    "slug": "woven-leather-backpack",
    "price": 29500,
    "images": [
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/woven-leather-backpack-pdp-white.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/woven-leather-backpack-pdp-02.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/woven-leather-backpack-pdp-03.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/woven-leather-backpack-pdp-04.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/woven-leather-backpack-pdp-05.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/woven-leather-backpack-pdp-06.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/woven-leather-backpack-pdp-07.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/woven-leather-backpack-pdp-08.webp",
      "https://xbtabpurfavngwmwtawc.supabase.co/storage/v1/object/public/products/drop-02/woven-leather-backpack-pdp-09.webp"
    ],
    "category": "Backpack",
    "status": "available",
    "featured": true,
    "materials": [
      "Full-grain Moroccan leather",
      "Hand-woven leather panels",
      "Solid brass hardware",
      "Hand-finished in Marrakech"
    ],
    "dimensions": {
      "size": "See product page for current dimensions"
    },
    "description": "Dark-chocolate full-grain leather woven by hand into a diamond lattice across the body and flap. Drawstring inner closure under the buckled flap. Smooth saddle leather base and shoulder straps. The most labour-intensive bag in the drop.",
    "available_quantity": 10,
    "weight_lbs": null,
    "craftsman_id": null,
    "created_at": "",
    "updated_at": ""
  }
];

// Merge a Supabase product list with STATIC_PRODUCTS:
//   1. For each Supabase row whose slug also exists in STATIC, overlay STATIC's
//      category if Supabase's is the legacy "Leather Goods" value. Keeps
//      Supabase's descriptions / prices / images but fixes category routing
//      before the recategorize SQL migration is applied.
//   2. Do NOT append STATIC-only rows in production. STATIC_PRODUCTS is an
//      offline fallback only; live storefront listings must come from Supabase.
export function mergeWithStatic(supabaseProducts: Product[]): Product[] {
  const staticBySlug = new Map(STATIC_PRODUCTS.map((p) => [p.slug, p]));
  const overlaid = supabaseProducts.map((p) => {
    const s = staticBySlug.get(p.slug);
    if (s && p.category === "Leather Goods" && s.category !== "Leather Goods") {
      return { ...p, category: s.category };
    }
    return p;
  });
  return overlaid;
}

export const CATEGORIES = [
  "All",
  "Backpack",
  "Briefcase",
  "Crossbody",
  "Duffle",
  "Messenger",
  "Rolltop",
  "Saddlebag",
  "Satchel",
  "Tote",
  "Weekender",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const LIGHTING_DB_CATEGORIES = [] as const;

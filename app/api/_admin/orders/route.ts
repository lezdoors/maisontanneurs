import { NextRequest, NextResponse } from "next/server";
import { getSession, getAdminSupabase } from "@/lib/admin-auth";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  // Verify admin session via cookie
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const {
    etsy_order_id,
    customer_name,
    customer_email,
    items,
    total,
    shipping_address,
  } = body;

  if (!etsy_order_id || !customer_name || !customer_email || !items?.length) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const supabase = getAdminSupabase();

  const { data, error } = await supabase
    .from("orders")
    .insert({
      order_number: generateOrderNumber(),
      sales_channel: "etsy",
      etsy_order_id,
      customer_name,
      customer_email,
      items,
      subtotal: total,
      shipping_cost: 0,
      total,
      shipping_address,
      status: "paid", // Etsy orders are already paid
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create Etsy order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }

  return NextResponse.json({ order: data });
}

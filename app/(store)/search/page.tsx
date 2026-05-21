import { redirect } from "next/navigation";

// /search is an alias for /products with the same query semantics.
// The Navbar's search field already routes to /products?q=...; this route
// exists so external links to /search or /search?q=foo keep working.
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  if (q) redirect(`/products?q=${encodeURIComponent(q)}`);
  redirect("/products");
}

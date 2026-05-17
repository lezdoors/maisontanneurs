import { redirect, notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import DeleteButton from "@/components/admin/DeleteButton";
import { getAdminSupabase } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";
import type { Product } from "@/lib/supabase/types";

const CATEGORIES = ["Tables", "Seating", "Lighting", "Mirrors", "Decor"];

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getAdminSupabase();

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  const product = data as Product;

  async function updateProduct(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || slugify(title);
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const price = Math.round(parseFloat(priceStr) * 100);
    const category = (formData.get("category") as string).toLowerCase();
    const materialsRaw = formData.get("materials") as string;
    const materials = materialsRaw
      ? materialsRaw.split(",").map((m) => m.trim()).filter(Boolean)
      : [];
    const width = formData.get("width") as string;
    const depth = formData.get("depth") as string;
    const height = formData.get("height") as string;
    const dimensions: Record<string, string> = {};
    if (width) dimensions.width = width;
    if (depth) dimensions.depth = depth;
    if (height) dimensions.height = height;
    const weight = formData.get("weight")
      ? parseFloat(formData.get("weight") as string)
      : null;
    const available_quantity = parseInt(
      (formData.get("available_quantity") as string) || "1",
      10
    );
    const featured = formData.get("featured") === "on";
    const status = formData.get("status") as Product["status"];
    const imagesRaw = formData.get("images") as string;
    const images = imagesRaw
      ? imagesRaw.split(",").map((i) => i.trim()).filter(Boolean)
      : [];

    const supabase = getAdminSupabase();
    const { error } = await supabase
      .from("products")
      .update({
        title,
        slug,
        description: description || null,
        price,
        category,
        materials,
        dimensions,
        weight_lbs: weight,
        available_quantity,
        featured,
        images,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Failed to update product:", error);
      redirect(`/admin/products/${id}/edit?error=update_failed`);
    }

    redirect("/admin/products");
  }

  async function deleteProduct() {
    "use server";

    const supabase = getAdminSupabase();
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete product:", error);
      redirect(`/admin/products/${id}/edit?error=delete_failed`);
    }

    redirect("/admin/products");
  }

  return (
    <AdminShell active="/admin/products">
      <div className="max-w-2xl space-y-6">
        <div>
          <p className="eyebrow mb-2">Catalog</p>
          <h1 className="font-display text-2xl text-ink">Edit Product</h1>
        </div>

        <form action={updateProduct} className="space-y-6">
          <InputField label="Title" name="title" required defaultValue={product.title} />
          <InputField label="Slug" name="slug" defaultValue={product.slug} />
          <TextareaField
            label="Description"
            name="description"
            rows={4}
            defaultValue={product.description || ""}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Price ($)"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={(product.price / 100).toFixed(2)}
            />
            <SelectField
              label="Category"
              name="category"
              options={CATEGORIES}
              required
              defaultValue={product.category}
            />
          </div>

          <InputField
            label="Materials"
            name="materials"
            defaultValue={product.materials?.join(", ") || ""}
          />

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted mb-3">
              Dimensions
            </p>
            <div className="grid grid-cols-3 gap-4">
              <InputField
                label="Width"
                name="width"
                defaultValue={product.dimensions?.width || ""}
              />
              <InputField
                label="Depth"
                name="depth"
                defaultValue={product.dimensions?.depth || ""}
              />
              <InputField
                label="Height"
                name="height"
                defaultValue={product.dimensions?.height || ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Weight (lbs)"
              name="weight"
              type="number"
              step="0.1"
              min="0"
              defaultValue={product.weight_lbs?.toString() || ""}
            />
            <InputField
              label="Available Quantity"
              name="available_quantity"
              type="number"
              min="0"
              defaultValue={product.available_quantity.toString()}
            />
          </div>

          <SelectField
            label="Status"
            name="status"
            options={["Available", "Sold", "Reserved"]}
            defaultValue={product.status}
          />

          <InputField
            label="Images"
            name="images"
            defaultValue={product.images?.join(", ") || ""}
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product.featured}
              className="w-4 h-4 accent-ink"
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink">
              Featured Product
            </span>
          </label>

          <div className="flex items-center gap-3 pt-4 border-t border-rule">
            <button
              type="submit"
              className="px-6 py-2.5 bg-ink text-paper font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-ink-soft transition-colors"
            >
              Save Changes
            </button>
            <a
              href="/admin/products"
              className="px-6 py-2.5 border border-rule text-muted font-mono text-[11px] uppercase tracking-[0.22em] hover:text-ink hover:border-ink transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>

        {/* Delete */}
        <div className="pt-6 border-t border-rule">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted mb-3">
            Danger Zone
          </p>
          <DeleteButton
            action={deleteProduct}
            label="Delete Product"
            confirmMessage="Delete this product? This cannot be undone."
          />
        </div>
      </div>
    </AdminShell>
  );
}

function InputField({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  defaultValue,
  step,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  step?: string;
  min?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        step={step}
        min={min}
        className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
      />
    </div>
  );
}

function TextareaField({
  label,
  name,
  rows = 3,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  rows?: number;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-2"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors resize-y"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  required = false,
  defaultValue,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-2"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="w-full px-4 py-2.5 bg-transparent border border-rule text-ink font-sans text-[15px] focus:outline-none focus:border-ink transition-colors"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt.toLowerCase()}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

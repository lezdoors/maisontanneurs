import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminSupabase } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";

const CATEGORIES = ["Tables", "Seating", "Lighting", "Mirrors", "Decor"];

export default function NewProductPage() {
  async function createProduct(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || slugify(title);
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const price = Math.round(parseFloat(priceStr) * 100); // Convert dollars to cents
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
    const imagesRaw = formData.get("images") as string;
    const images = imagesRaw
      ? imagesRaw.split(",").map((i) => i.trim()).filter(Boolean)
      : [];

    const supabase = getAdminSupabase();
    const { error } = await supabase.from("products").insert({
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
      status: "available",
    });

    if (error) {
      console.error("Failed to create product:", error);
      redirect("/admin/products/new?error=create_failed");
    }

    redirect("/admin/products");
  }

  return (
    <AdminShell active="/admin/products">
      <div className="max-w-2xl space-y-6">
        <div>
          <p className="eyebrow mb-2">Catalog</p>
          <h1 className="font-display text-2xl text-ink">Add Product</h1>
        </div>

        <form action={createProduct} className="space-y-6">
          <InputField label="Title" name="title" required />
          <InputField
            label="Slug"
            name="slug"
            placeholder="auto-generated from title"
          />
          <TextareaField label="Description" name="description" rows={4} />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Price ($)"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
            />
            <SelectField
              label="Category"
              name="category"
              options={CATEGORIES}
              required
            />
          </div>

          <InputField
            label="Materials"
            name="materials"
            placeholder="Cedar wood, brass, bone inlay"
          />

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted mb-3">
              Dimensions
            </p>
            <div className="grid grid-cols-3 gap-4">
              <InputField label="Width" name="width" placeholder='24"' />
              <InputField label="Depth" name="depth" placeholder='24"' />
              <InputField label="Height" name="height" placeholder='18"' />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Weight (lbs)"
              name="weight"
              type="number"
              step="0.1"
              min="0"
            />
            <InputField
              label="Available Quantity"
              name="available_quantity"
              type="number"
              min="0"
              defaultValue="1"
            />
          </div>

          <InputField
            label="Images"
            name="images"
            placeholder="/products/item-1.jpg, /products/item-2.jpg"
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              className="w-4 h-4 accent-ink"
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink">
              Featured Product
            </span>
          </label>

          <div className="flex gap-3 pt-4 border-t border-rule">
            <button
              type="submit"
              className="px-6 py-2.5 bg-ink text-paper font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-ink-soft transition-colors"
            >
              Create Product
            </button>
            <a
              href="/admin/products"
              className="px-6 py-2.5 border border-rule text-muted font-mono text-[11px] uppercase tracking-[0.22em] hover:text-ink hover:border-ink transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
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

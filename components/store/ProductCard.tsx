import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  slug: string;
  origin?: string;
  badge?: string;
}

export default function ProductCard({
  title,
  price,
  image,
  slug,
}: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="group block">
      {/* Image — clean, no border, no badge */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
        />
      </div>

      {/* Info — centered, serif */}
      <div className="flex flex-col items-center gap-1.5 pt-5">
        <h3 className="font-serif text-[15px] tracking-[0.12em] uppercase text-ink text-center leading-tight">
          {title}
        </h3>
        <span className="font-serif text-[14px] tracking-[0.08em] text-mineral">
          {formatPrice(price)}
        </span>
      </div>
    </Link>
  );
}

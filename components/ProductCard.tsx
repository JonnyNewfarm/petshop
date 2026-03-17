import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl: string;
    category: {
      name: string;
    };
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      {/* IMAGE */}
      <div className="relative aspect-[0.82] overflow-hidden bg-[#e7e2db]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="
            object-cover
            transition
            duration-[1200ms]
            ease-[cubic-bezier(.19,1,.22,1)]
            group-hover:scale-[1.06]
          "
        />

        {/* subtle overlay on hover */}
        <div
          className="
          pointer-events-none
          absolute inset-0
          bg-black/0
          transition
          duration-500
          group-hover:bg-black/10
        "
        />
      </div>

      {/* INFO */}
      <div className="pt-5">
        <p
          className="
          text-[10px]
          uppercase
          tracking-[0.22em]
          text-black/45
        "
        >
          {product.category.name}
        </p>

        <h3
          className="
            mt-2
            text-[1rem]
            font-semibold
            uppercase
            leading-[1.05]
            tracking-[-0.01em]
            transition
            duration-300
            group-hover:translate-x-[6px]
          "
        >
          {product.name}
        </h3>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[13px] tracking-[-0.01em] text-black/75">
            {formatPrice(product.price)}
          </p>

          {/* arrow micro interaction */}
          <span
            className="
            text-[11px]
            uppercase
            tracking-[0.18em]
            opacity-0
            transition
            duration-300
            group-hover:opacity-100
            group-hover:translate-x-1
          "
          >
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}

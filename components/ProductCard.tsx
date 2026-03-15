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
    <Link
      href={`/shop/${product.slug}`}
      className="group block border border-black/10 bg-white"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f3efe8]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
          {product.category.name}
        </p>

        <h3 className="mt-2 text-lg font-medium text-black">{product.name}</h3>

        <p className="mt-3 text-sm text-black/70">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

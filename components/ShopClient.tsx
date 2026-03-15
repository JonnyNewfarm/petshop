"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: {
    name: string;
    slug: string;
  };
  images: {
    id: string;
    url: string;
    alt: string | null;
    order: number;
  }[];
};

const categories = [
  { label: "All", value: "all" },
  { label: "Dogs", value: "dogs" },
  { label: "Cats", value: "cats" },
  { label: "Small Pets", value: "small-pets" },
  { label: "Birds", value: "birds" },
  { label: "Fish", value: "fish" },
];

export default function ShopClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const query =
          selectedCategory !== "all"
            ? `?category=${encodeURIComponent(selectedCategory)}`
            : "";

        const response = await fetch(`/api/products${query}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const heading = useMemo(() => {
    const current = categories.find((cat) => cat.value === selectedCategory);
    return current?.label || "Shop";
  }, [selectedCategory]);

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-6 py-28 text-black sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
            Shop
          </p>

          <h1 className="mt-4 text-[clamp(2.5rem,6vw,5.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
            {heading === "All" ? "Pet essentials" : heading}
          </h1>

          <p className="mt-4 max-w-[620px] text-base leading-7 text-black/65">
            Explore thoughtfully selected products for dogs, cats, small pets,
            birds and fish.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          {categories.map((category) => {
            const active = selectedCategory === category.value;

            return (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`border px-5 py-3 text-[12px] uppercase tracking-[0.18em] transition ${
                  active
                    ? "border-black bg-black text-[#f6f1e8]"
                    : "border-black/10 bg-white text-black hover:border-black"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="py-20 text-sm uppercase tracking-[0.18em] text-black/45">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-sm uppercase tracking-[0.18em] text-black/45">
            No products found.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  imageUrl: product.images[0]?.url ?? "/placeholder.jpg",
                  category: {
                    name: product.category.name,
                  },
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

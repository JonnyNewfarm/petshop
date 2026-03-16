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
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
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

const tags = [
  { label: "Beds", value: "beds" },
  { label: "Toys", value: "toys" },
  { label: "Treats", value: "treats" },
  { label: "Bowls", value: "bowls" },
  { label: "Grooming", value: "grooming" },
  { label: "Travel", value: "travel" },
  { label: "Orthopedic", value: "orthopedic" },
  { label: "Eco", value: "eco" },
];

export default function ShopClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "all";
  const selectedTag = searchParams.get("tag") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (selectedCategory !== "all") {
          params.set("category", selectedCategory);
        }

        if (selectedTag) {
          params.set("tag", selectedTag);
        }

        const query = params.toString() ? `?${params.toString()}` : "";

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
  }, [selectedCategory, selectedTag]);

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

  const handleTagChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedTag === value) {
      params.delete("tag");
    } else {
      params.set("tag", value);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <main className="min-h-screen bg-[#dddad5] px-6 py-28 text-black sm:px-8 lg:px-12">
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

        <div className="space-y-6">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-black/45">
              Categories
            </p>

            <div className="flex flex-wrap gap-3">
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
          </div>

          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-black/45">
              Tags
            </p>

            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => {
                const active = selectedTag === tag.value;

                return (
                  <button
                    key={tag.value}
                    onClick={() => handleTagChange(tag.value)}
                    className={`border px-5 py-3 text-[12px] uppercase tracking-[0.18em] transition ${
                      active
                        ? "border-black bg-black text-[#f6f1e8]"
                        : "border-black/10 bg-white text-black hover:border-black"
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}

              {(selectedCategory !== "all" || selectedTag) && (
                <button
                  onClick={clearFilters}
                  className="border border-black/10 bg-white px-5 py-3 text-[12px] uppercase tracking-[0.18em] text-black transition hover:border-black"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10">
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
      </div>
    </main>
  );
}

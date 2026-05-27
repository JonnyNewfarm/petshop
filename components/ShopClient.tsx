"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import FilterSelect from "@/components/FilterSelect";

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

type Pagination = {
  page: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
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
  { label: "All tags", value: "all-tags" },
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
  const selectedSearch = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page") || "1");

  const [searchInput, setSearchInput] = useState(selectedSearch);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 9,
    totalProducts: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setSearchInput(selectedSearch);
  }, [selectedSearch]);

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

        if (selectedSearch) {
          params.set("search", selectedSearch);
        }

        params.set("page", String(currentPage));
        params.set("limit", "9");

        const query = params.toString() ? `?${params.toString()}` : "";

        const response = await fetch(`/api/products${query}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data.products);
        setPagination(data.pagination);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedTag, selectedSearch, currentPage]);

  const heading = useMemo(() => {
    const current = categories.find((cat) => cat.value === selectedCategory);
    return current?.label || "Shop";
  }, [selectedCategory]);

  const selectedTagLabel = useMemo(() => {
    return tags.find((tag) => tag.value === selectedTag)?.label || "";
  }, [selectedTag]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleCategoryChange = (value: string) => {
    updateUrl({
      category: value === "all" ? null : value,
      page: "1",
    });
  };

  const handleTagChange = (value: string) => {
    updateUrl({
      tag: value === "all-tags" ? null : value,
      page: "1",
    });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateUrl({
      search: searchInput.trim() || null,
      page: "1",
    });
  };

  const clearSearch = () => {
    setSearchInput("");
    updateUrl({
      search: null,
      page: "1",
    });
  };

  const handlePageChange = (page: number) => {
    updateUrl({
      page: String(page),
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    router.push(pathname);
  };

  const hasActiveFilters =
    selectedCategory !== "all" || !!selectedTag || !!selectedSearch;

  return (
    <main className="min-h-screen bg-[#dddad5] text-black">
      <div className="mx-auto max-w-[1600px] px-6 pb-20 pt-28 sm:px-8 lg:px-12">
        <section className="border-b border-black/10 pb-14 lg:pb-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="max-w-[980px]">
              <p className="text-[11px] uppercase tracking-[0.24em] text-black/45">
                Curated shop
              </p>

              <h1
                style={{ fontFamily: "Mango" }}
                className="mt-5 text-[clamp(3.4rem,9vw,9rem)] uppercase leading-[0.88] tracking-[-0.02em]"
              >
                {heading === "All" ? "Pet essentials" : heading}
              </h1>

              <p className="mt-6 max-w-[620px] text-[15px] leading-7 text-black/62 md:text-base">
                Explore thoughtfully selected products for dogs, cats, small
                pets, birds and fish — designed for everyday life with pets.
              </p>
            </div>

            <div className="flex flex-col justify-end">
              <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-black/10 pt-6 sm:grid-cols-3 lg:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                    Products
                  </p>
                  <p className="mt-2 text-2xl leading-none tracking-[-0.04em]">
                    {loading ? "..." : pagination.totalProducts}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                    Category
                  </p>
                  <p className="mt-2 text-2xl leading-none tracking-[-0.04em]">
                    {heading}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                    Selection
                  </p>
                  <p className="mt-2 text-2xl leading-none tracking-[-0.04em]">
                    2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-12 pt-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12 lg:pt-12">
          <aside className="relative lg:sticky lg:top-24 lg:self-start">
            <div className="border border-black/10 bg-[#e6e2dc]">
              <button
                type="button"
                onClick={() => setFiltersOpen((prev) => !prev)}
                className="flex w-full items-center justify-between px-5 py-5 text-left sm:px-6 lg:pointer-events-none"
                aria-expanded={filtersOpen}
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
                    Filters
                  </p>
                  <h2 className="mt-2 text-[1.15rem] uppercase tracking-[-0.03em]">
                    Refine selection
                  </h2>
                </div>

                <div className="flex items-center gap-4 lg:hidden">
                  {hasActiveFilters && (
                    <span className="text-[10px] uppercase tracking-[0.18em] text-black/45">
                      Active
                    </span>
                  )}
                  <span className="text-lg leading-none">
                    {filtersOpen ? "−" : "+"}
                  </span>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out lg:max-h-none lg:opacity-100 ${
                  filtersOpen
                    ? "max-h-[1200px] opacity-100"
                    : "max-h-0 opacity-0"
                } lg:block`}
              >
                <div className="border-t border-black/10 px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
                  <div className="mb-8 flex items-end justify-between gap-4 border-b border-black/10 pb-5">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
                        Search & filters
                      </p>
                      <p className="mt-2 text-sm leading-6 text-black/58">
                        Narrow the collection with category, tag, or search.
                      </p>
                    </div>

                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-[11px] uppercase tracking-[0.18em] text-black/55 transition hover:text-black"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div>
                      <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-black/45">
                        Search
                      </p>

                      <form onSubmit={handleSearchSubmit} className="space-y-3">
                        <input
                          type="text"
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          placeholder="Search products..."
                          className="w-full border-0 border-b border-black/80 px-4 py-4 text-sm outline-none placeholder:text-black/35 focus:border-black"
                        />

                        <div className="flex gap-3">
                          <button
                            type="submit"
                            className="flex-1 border border-black px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-black transition hover:bg-black/80 hover:text-white"
                          >
                            Search
                          </button>

                          {selectedSearch && (
                            <button
                              type="button"
                              onClick={clearSearch}
                              className="border border-black/10 bg-[#f3efe8] px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-black transition hover:border-black"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    <FilterSelect
                      label="Category"
                      value={selectedCategory}
                      options={categories}
                      onValueChange={handleCategoryChange}
                      placeholder="Select category"
                    />

                    <FilterSelect
                      label="Tag"
                      value={selectedTag || "all-tags"}
                      options={tags}
                      onValueChange={handleTagChange}
                      placeholder="All tags"
                    />

                    {hasActiveFilters && (
                      <div className="border-t border-black/10 pt-5">
                        <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-black/45">
                          Active filters
                        </p>

                        <div className="flex flex-wrap gap-2.5">
                          {selectedCategory !== "all" && (
                            <button
                              onClick={() => handleCategoryChange("all")}
                              className="bg-[#f3efe8] px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] transition hover:bg-black hover:text-[#f6f1e8]"
                            >
                              {heading} ×
                            </button>
                          )}

                          {selectedTag && (
                            <button
                              onClick={() => handleTagChange("all-tags")}
                              className="bg-[#f3efe8] px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] transition hover:bg-black hover:text-[#f6f1e8]"
                            >
                              {selectedTagLabel} ×
                            </button>
                          )}

                          {selectedSearch && (
                            <button
                              onClick={clearSearch}
                              className="bg-[#f3efe8] px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] transition hover:bg-black hover:text-[#f6f1e8]"
                            >
                              {selectedSearch} ×
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
                  Collection
                </p>
                <h2 className="mt-2 text-[1.4rem] uppercase tracking-[-0.04em]">
                  {heading === "All" ? "All products" : `${heading} selection`}
                </h2>
              </div>

              <div className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                {loading
                  ? "Loading..."
                  : `${pagination.totalProducts} products`}
              </div>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[0.82] animate-pulse bg-[#e7e2db]"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex min-h-[420px] items-center justify-center border border-black/10 bg-[#e6e2dc] px-6 text-center">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
                    No results
                  </p>
                  <h3 className="mt-3 text-2xl uppercase tracking-[-0.04em]">
                    No products found
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-black/60">
                    Try another category, tag, or search term to explore more
                    products.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-6 border border-black bg-black px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <div key={product.id} className="group">
                      <ProductCard
                        product={{
                          id: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: product.price,
                          imageUrl:
                            product.images[0]?.url ?? "/placeholder.jpg",
                          category: {
                            name: product.category.name,
                          },
                        }}
                      />
                    </div>
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="mt-16 border-t border-black/10 pt-10">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-black/40">
                          Navigation
                        </p>

                        <p className="text-[11px] uppercase tracking-[0.22em] text-black/40">
                          Page {pagination.page} of {pagination.totalPages}
                        </p>
                      </div>

                      {/* Mobile pagination */}
                      <div className="grid grid-cols-2 border-y border-black/20 sm:hidden">
                        <button
                          type="button"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={!pagination.hasPreviousPage}
                          className="group relative overflow-hidden border-r border-black px-5 py-5 text-left disabled:pointer-events-none disabled:opacity-30"
                        >
                          <span className="absolute inset-0 translate-y-full bg-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />

                          <span className="relative z-10 block text-[10px] uppercase tracking-[0.22em] text-black/45 transition-colors group-hover:text-white/55">
                            Previous
                          </span>

                          <span className="relative z-10 mt-2 block text-2xl uppercase leading-none tracking-[-0.06em] transition-colors group-hover:text-[#f6f1e8]">
                            Prev
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={!pagination.hasNextPage}
                          className="group relative overflow-hidden px-5 py-5 text-right disabled:pointer-events-none disabled:opacity-30"
                        >
                          <span className="absolute inset-0 translate-y-full bg-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />

                          <span className="relative z-10 block text-[10px] uppercase tracking-[0.22em] text-black/45 transition-colors group-hover:text-white/55">
                            Next
                          </span>

                          <span className="relative z-10 mt-2 block text-2xl uppercase leading-none tracking-[-0.06em] transition-colors group-hover:text-[#f6f1e8]">
                            Next
                          </span>
                        </button>
                      </div>

                      {/* Desktop pagination */}
                      <div className="hidden  sm:grid sm:grid-cols-[1fr_auto_1fr]">
                        <button
                          type="button"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={!pagination.hasPreviousPage}
                          className="group relative overflow-hidden cursor-pointer px-8 py-7 text-left disabled:pointer-events-none disabled:opacity-25"
                        >
                          <span className="absolute inset-0 translate-y-full bg-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />

                          <span className="relative z-10 block text-[11px] uppercase tracking-[0.24em] text-black/40 transition-colors group-hover:text-white/50">
                            Previous page
                          </span>

                          <span className="relative z-10 mt-3 flex items-center gap-4 text-[clamp(1rem,3vw,3rem)] uppercase leading-none tracking-[-0.08em] transition-colors group-hover:text-[#f6f1e8]">
                            Previous
                          </span>
                        </button>

                        <div className="flex items-center  px-8 text-center">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.24em] text-black/40">
                              Page
                            </p>

                            <p className="mt-2 text-5xl leading-none tracking-[-0.08em]">
                              {String(pagination.page).padStart(2, "0")}
                            </p>

                            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-black/40">
                              / {String(pagination.totalPages).padStart(2, "0")}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={!pagination.hasNextPage}
                          className="group relative cursor-pointer overflow-hidden px-8 py-7 text-right disabled:pointer-events-none disabled:opacity-25"
                        >
                          <span className="absolute inset-0 translate-y-full bg-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />

                          <span className="relative z-10 block text-[11px] uppercase tracking-[0.24em] text-black/40 transition-colors group-hover:text-white/50">
                            Next page
                          </span>

                          <span className="relative z-10 mt-3 flex items-center justify-end gap-4 text-[clamp(1rem,3vw,3rem)] uppercase leading-none tracking-[-0.08em] transition-colors group-hover:text-[#f6f1e8]">
                            Next
                          </span>
                        </button>
                      </div>

                      {/* Page numbers */}
                      <div className="flex flex-wrap items-center justify-start gap-2">
                        {Array.from(
                          { length: pagination.totalPages },
                          (_, index) => index + 1,
                        ).map((page) => {
                          const active = page === pagination.page;

                          return (
                            <button
                              key={page}
                              type="button"
                              onClick={() => handlePageChange(page)}
                              className={`relative h-10 min-w-10 overflow-hidden px-4 text-[15px] uppercase tracking-[0.18em] transition ${
                                active
                                  ? " scale-130 mb-[2px] font-bold text-black"
                                  : " text-black"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

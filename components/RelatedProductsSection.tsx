"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/format";

type RelatedProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  categoryName: string;
  imageUrl: string;
  imageAlt: string;
  inStock: boolean;
};

type RelatedProductsSectionProps = {
  title: string;
  products: RelatedProduct[];
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function RelatedProductsSection({
  title,
  products,
}: RelatedProductsSectionProps) {
  return (
    <section className="pt-16 lg:pt-24">
      <div className="mb-8 border-t border-black/10 pt-6 sm:mb-10 lg:mb-12 lg:pt-8">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-[720px]">
            <p className="text-[10px] uppercase tracking-[0.28em] text-black/40 sm:text-[11px]">
              Related products
            </p>

            <h2
              style={{ fontFamily: "Mango" }}
              className="mt-3 text-[clamp(2rem,4vw,4.75rem)] uppercase leading-[0.9] tracking-[-0.03em]"
            >
              {title}
            </h2>

            <p className="mt-3 max-w-[540px] text-sm leading-6 text-black/55 sm:text-[15px]">
              A curated selection of pieces with a similar character, feel and
              function.
            </p>
          </div>

          <Link
            href="/shop"
            className="hidden min-h-[46px] items-center justify-center border border-black/15 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-black transition hover:border-black hover:bg-black hover:text-[#f6f1e8] sm:inline-flex"
          >
            View all
          </Link>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            className="min-w-0 h-full"
          >
            <Link
              href={`/product/${product.slug}`}
              className="group block h-full"
            >
              <motion.article
                whileHover={{
                  y: -8,
                  transition: {
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                className="relative flex h-full flex-col overflow-hidden border border-black/10 bg-[#e6e2dc]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-black/10" />

                <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe7e1]">
                  <motion.img
                    src={product.imageUrl}
                    alt={product.imageAlt}
                    whileHover={{
                      scale: 1.06,
                      transition: {
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }}
                    className="h-full w-full object-cover"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="absolute left-4 top-4 z-10">
                    <span className="inline-flex items-center border border-white/25 bg-black/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-md">
                      {product.categoryName}
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4 z-10">
                    <span className="inline-flex items-center border border-white/20 bg-white/12 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      {product.inStock ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                </div>

                <motion.div
                  whileHover={{
                    y: -2,
                    transition: {
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                  className="relative flex flex-1 flex-col px-4 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="h-px w-full bg-black/10" />
                    <p className="shrink-0 text-[10px] uppercase tracking-[0.22em] text-black/35">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                  </div>

                  <h3 className="max-w-[18ch] min-h-[3.2em] text-[1.02rem] uppercase leading-[1.02] tracking-[-0.03em] text-black sm:text-[1.08rem]">
                    {product.name}
                  </h3>

                  <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                    <p className="text-[15px] tracking-[-0.03em] text-black/75">
                      {formatPrice(product.price)}
                    </p>

                    <span className="text-[10px] uppercase tracking-[0.18em] text-black/40 transition-transform duration-300 group-hover:translate-x-1">
                      Explore
                    </span>
                  </div>
                </motion.div>
              </motion.article>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="pt-6 sm:hidden">
        <Link
          href="/shop"
          className="inline-flex min-h-[46px] items-center justify-center border border-black/15 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-black transition hover:border-black hover:bg-black hover:text-[#f6f1e8]"
        >
          View all
        </Link>
      </div>
    </section>
  );
}

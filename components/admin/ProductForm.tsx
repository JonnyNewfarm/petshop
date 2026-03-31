"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/product-actions";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Tag = {
  id: string;
  name: string;
  slug: string;
};

type GeneratedVariant = {
  name: string;
  price: number | "";
  stock: number;
  options: {
    name: string;
    value: string;
  }[];
};

type OptionGroup = {
  id: string;
  name: string;
  values: string[];
};

type EditableReview = {
  id: string;
  authorName: string;
  authorCountry: string;
  rating: number;
  title: string;
  content: string;
  imageUrl: string;
  verified: boolean;
  source: string;
  reviewDate: string;
  sortOrder: number;
};

type ProductFormInitialData = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  featured: boolean;
  badge: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  benefits: string[] | null;
  categoryId: string;
  sizeGuideEnabled: boolean;
  sizeGuideTitle: string | null;
  sizeGuideContent: string | null;
  images: {
    url: string;
  }[];
  variants: {
    name: string;
    price: number | null;
    stock: number;
    options: {
      name: string;
      value: string;
    }[];
  }[];
  reviews?: {
    authorName: string;
    authorCountry: string | null;
    rating: number;
    title: string | null;
    content: string;
    imageUrl: string | null;
    verified: boolean;
    source: string | null;
    reviewDate?: string | null;
    sortOrder?: number;
  }[];
  tags: {
    id: string;
  }[];
};

const initialState = {
  error: "",
  success: false,
};

function cartesianProduct(groups: OptionGroup[]) {
  const validGroups = groups
    .map((group) => ({
      name: group.name.trim(),
      values: group.values.map((value) => value.trim()).filter(Boolean),
    }))
    .filter((group) => group.name && group.values.length > 0);

  if (validGroups.length === 0) return [];

  let result: { name: string; value: string }[][] = [[]];

  for (const group of validGroups) {
    const next: { name: string; value: string }[][] = [];

    for (const combination of result) {
      for (const value of group.values) {
        next.push([...combination, { name: group.name, value }]);
      }
    }

    result = next;
  }

  return result;
}

function buildOptionGroupsFromVariants(
  variants: ProductFormInitialData["variants"],
): OptionGroup[] {
  const groupMap = new Map<string, string[]>();

  for (const variant of variants) {
    for (const option of variant.options) {
      const existing = groupMap.get(option.name) ?? [];
      if (!existing.includes(option.value)) {
        existing.push(option.value);
      }
      groupMap.set(option.name, existing);
    }
  }

  if (groupMap.size === 0) {
    return [
      {
        id: "option-group-1",
        name: "Color",
        values: [""],
      },
    ];
  }

  return Array.from(groupMap.entries()).map(([name, values], index) => ({
    id: `option-group-${index + 1}`,
    name,
    values,
  }));
}

function createEmptyReview(index: number): EditableReview {
  return {
    id: `review-${Date.now()}-${index}`,
    authorName: "",
    authorCountry: "",
    rating: 5,
    title: "",
    content: "",
    imageUrl: "",
    verified: false,
    source: "online reviews",
    reviewDate: "",
    sortOrder: index,
  };
}

export default function ProductForm({
  categories,
  tags,
  initialData,
}: {
  categories: Category[];
  tags: Tag[];
  initialData?: ProductFormInitialData;
}) {
  const router = useRouter();
  const isEdit = !!initialData;
  const action = isEdit ? updateProduct : createProduct;
  const [state, formAction, pending] = useActionState(action, initialState);

  const [images, setImages] = useState<string[]>(
    initialData?.images.length
      ? initialData.images.map((image) => image.url)
      : [""],
  );

  const [hasVariants, setHasVariants] = useState(
    initialData ? initialData.variants.length > 0 : false,
  );

  const [hasSizeGuide, setHasSizeGuide] = useState(
    initialData?.sizeGuideEnabled ?? false,
  );

  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>(
    initialData
      ? buildOptionGroupsFromVariants(initialData.variants)
      : [
          {
            id: "option-group-1",
            name: "Color",
            values: [""],
          },
        ],
  );

  const [variants, setVariants] = useState<GeneratedVariant[]>(
    initialData
      ? initialData.variants.map((variant) => ({
          name: variant.name,
          price: variant.price ?? "",
          stock: variant.stock > 0 ? 1 : 0,
          options: variant.options,
        }))
      : [],
  );

  const [reviews, setReviews] = useState<EditableReview[]>(
    initialData?.reviews?.length
      ? initialData.reviews.map((review, index) => ({
          id: `review-${index}`,
          authorName: review.authorName,
          authorCountry: review.authorCountry ?? "",
          rating: review.rating,
          title: review.title ?? "",
          content: review.content,
          imageUrl: review.imageUrl ?? "",
          verified: review.verified,
          source: review.source ?? "online reviews",
          reviewDate: review.reviewDate ? review.reviewDate.slice(0, 10) : "",
          sortOrder: review.sortOrder ?? index,
        }))
      : [],
  );

  useEffect(() => {
    if (state.success) {
      router.push("/admin/products");
    }
  }, [state.success, router]);

  const addImage = () => {
    setImages((prev) => [...prev, ""]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, value: string) => {
    setImages((prev) => prev.map((img, i) => (i === index ? value : img)));
  };

  const addOptionGroup = () => {
    setOptionGroups((prev) => [
      ...prev,
      {
        id: `option-group-${Date.now()}-${prev.length + 1}`,
        name: "",
        values: [""],
      },
    ]);
  };

  const removeOptionGroup = (groupId: string) => {
    setOptionGroups((prev) => prev.filter((group) => group.id !== groupId));
  };

  const updateOptionGroupName = (groupId: string, value: string) => {
    setOptionGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, name: value } : group,
      ),
    );
  };

  const addOptionValue = (groupId: string) => {
    setOptionGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, values: [...group.values, ""] }
          : group,
      ),
    );
  };

  const removeOptionValue = (groupId: string, valueIndex: number) => {
    setOptionGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              values: group.values.filter((_, index) => index !== valueIndex),
            }
          : group,
      ),
    );
  };

  const updateOptionValue = (
    groupId: string,
    valueIndex: number,
    value: string,
  ) => {
    setOptionGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              values: group.values.map((item, index) =>
                index === valueIndex ? value : item,
              ),
            }
          : group,
      ),
    );
  };

  const generateVariants = () => {
    const combinations = cartesianProduct(optionGroups);

    if (combinations.length === 0) {
      setVariants([]);
      return;
    }

    setVariants((prev) => {
      return combinations.map((combination) => {
        const name = combination.map((item) => item.value).join(" / ");
        const existing = prev.find((variant) => variant.name === name);

        return {
          name,
          price: existing?.price ?? "",
          stock: existing?.stock ?? 1,
          options: combination,
        };
      });
    });
  };

  const removeGeneratedVariant = (variantIndex: number) => {
    setVariants((prev) => prev.filter((_, index) => index !== variantIndex));
  };

  const updateGeneratedVariant = <
    K extends keyof Omit<GeneratedVariant, "options">,
  >(
    variantIndex: number,
    field: K,
    value: GeneratedVariant[K],
  ) => {
    setVariants((prev) =>
      prev.map((variant, index) =>
        index === variantIndex ? { ...variant, [field]: value } : variant,
      ),
    );
  };

  const addReview = () => {
    setReviews((prev) => [...prev, createEmptyReview(prev.length)]);
  };

  const removeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev
        .filter((review) => review.id !== reviewId)
        .map((review, index) => ({
          ...review,
          sortOrder: index,
        })),
    );
  };

  const updateReview = <K extends keyof EditableReview>(
    reviewId: string,
    field: K,
    value: EditableReview[K],
  ) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, [field]: value } : review,
      ),
    );
  };

  const serializedImageUrls = useMemo(() => {
    return images
      .map((url) => url.trim())
      .filter(Boolean)
      .join("\n");
  }, [images]);

  const serializedVariants = useMemo(() => {
    if (!hasVariants) return "";

    const cleanedVariants = variants
      .map((variant) => ({
        name: variant.name.trim(),
        price: variant.price === "" ? null : Number(variant.price),
        stock: Number(variant.stock) > 0 ? 1 : 0,
        options: variant.options
          .map((option) => ({
            name: option.name.trim(),
            value: option.value.trim(),
          }))
          .filter((option) => option.name && option.value),
      }))
      .filter((variant) => variant.name && variant.options.length > 0);

    return cleanedVariants.length ? JSON.stringify(cleanedVariants) : "";
  }, [hasVariants, variants]);

  const serializedBenefits = useMemo(() => {
    return (initialData?.benefits ?? []).join("\n");
  }, [initialData?.benefits]);

  const serializedReviews = useMemo(() => {
    const cleanedReviews = reviews
      .map((review, index) => ({
        authorName: review.authorName.trim(),
        authorCountry: review.authorCountry.trim() || null,
        rating: Math.max(1, Math.min(5, Number(review.rating) || 5)),
        title: review.title.trim() || null,
        content: review.content.trim(),
        imageUrl: review.imageUrl.trim() || null,
        verified: review.verified,
        source: review.source.trim() || null,
        reviewDate: review.reviewDate
          ? new Date(`${review.reviewDate}T00:00:00.000Z`).toISOString()
          : null,
        sortOrder: index,
      }))
      .filter((review) => review.authorName && review.content);

    return cleanedReviews.length ? JSON.stringify(cleanedReviews) : "";
  }, [reviews]);

  return (
    <form action={formAction} className="space-y-10">
      {isEdit ? (
        <input type="hidden" name="productId" value={initialData.id} />
      ) : null}

      <input type="hidden" name="imageUrls" value={serializedImageUrls} />
      <input type="hidden" name="variantsJson" value={serializedVariants} />
      <input type="hidden" name="reviewsJson" value={serializedReviews} />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-10">
          <section className="border border-black/10 bg-white p-6">
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                Basic
              </p>
              <h2 className="mt-2 text-2xl font-medium">Product details</h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm uppercase tracking-[0.14em]"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  defaultValue={initialData?.name ?? ""}
                  className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="slug"
                  className="text-sm uppercase tracking-[0.14em]"
                >
                  Slug
                </label>
                <input
                  id="slug"
                  name="slug"
                  required
                  defaultValue={initialData?.slug ?? ""}
                  placeholder="orthopedic-dog-bed"
                  className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="shortDescription"
                  className="text-sm uppercase tracking-[0.14em]"
                >
                  Short description
                </label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  rows={3}
                  defaultValue={initialData?.shortDescription ?? ""}
                  placeholder="A refined everyday essential designed for comfort, durability and easy care."
                  className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm uppercase tracking-[0.14em]"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  defaultValue={initialData?.description ?? ""}
                  rows={7}
                  className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="benefits"
                  className="text-sm uppercase tracking-[0.14em]"
                >
                  Benefits / highlights
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  rows={5}
                  defaultValue={serializedBenefits}
                  placeholder={`Soft everyday comfort
Easy to clean
Durable materials
Designed for modern pet homes`}
                  className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                />
                <p className="text-xs text-black/45">One benefit per line.</p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="badge"
                  className="text-sm uppercase tracking-[0.14em]"
                >
                  Badge
                </label>
                <input
                  id="badge"
                  name="badge"
                  defaultValue={initialData?.badge ?? ""}
                  placeholder="Best seller"
                  className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                />
              </div>
            </div>
          </section>

          <section className="border border-black/10 bg-white p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                  Social proof
                </p>
                <h2 className="mt-2 text-2xl font-medium">Reviews</h2>
              </div>

              <button
                type="button"
                onClick={addReview}
                className="border border-black bg-black px-5 py-3 text-sm uppercase tracking-[0.14em] text-[#f6f1e8]"
              >
                Add review
              </button>
            </div>

            {reviews.length === 0 ? (
              <p className="text-sm text-black/55">No reviews added yet.</p>
            ) : (
              <div className="space-y-5">
                {reviews.map((review, index) => (
                  <div
                    key={review.id}
                    className="space-y-5 border border-black/10 bg-[#f6f1e8] p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                          Review {index + 1}
                        </p>
                        <p className="mt-1 text-sm text-black/60">
                          {review.authorName || "Unnamed review"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeReview(review.id)}
                        className="border border-black/10 px-4 py-3 text-sm uppercase tracking-[0.14em]"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm uppercase tracking-[0.14em]">
                          Name
                        </label>
                        <input
                          value={review.authorName}
                          onChange={(e) =>
                            updateReview(
                              review.id,
                              "authorName",
                              e.target.value,
                            )
                          }
                          placeholder="Emma"
                          className="w-full border border-black/10 bg-white px-4 py-4 outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm uppercase tracking-[0.14em]">
                          Country
                        </label>
                        <input
                          value={review.authorCountry}
                          onChange={(e) =>
                            updateReview(
                              review.id,
                              "authorCountry",
                              e.target.value,
                            )
                          }
                          placeholder="US"
                          className="w-full border border-black/10 bg-white px-4 py-4 outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm uppercase tracking-[0.14em]">
                          Rating
                        </label>
                        <select
                          value={review.rating}
                          onChange={(e) =>
                            updateReview(
                              review.id,
                              "rating",
                              Number(e.target.value),
                            )
                          }
                          className="w-full border border-black/10 bg-white px-4 py-4 outline-none"
                        >
                          <option value={5}>5 stars</option>
                          <option value={4}>4 stars</option>
                          <option value={3}>3 stars</option>
                          <option value={2}>2 stars</option>
                          <option value={1}>1 star</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm uppercase tracking-[0.14em]">
                          Date
                        </label>
                        <input
                          type="date"
                          value={review.reviewDate}
                          onChange={(e) =>
                            updateReview(
                              review.id,
                              "reviewDate",
                              e.target.value,
                            )
                          }
                          className="w-full border border-black/10 bg-white px-4 py-4 outline-none"
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm uppercase tracking-[0.14em]">
                          Title
                        </label>
                        <input
                          value={review.title}
                          onChange={(e) =>
                            updateReview(review.id, "title", e.target.value)
                          }
                          placeholder="Easy to use"
                          className="w-full border border-black/10 bg-white px-4 py-4 outline-none"
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm uppercase tracking-[0.14em]">
                          Content
                        </label>
                        <textarea
                          rows={5}
                          value={review.content}
                          onChange={(e) =>
                            updateReview(review.id, "content", e.target.value)
                          }
                          placeholder="Makes bath time much easier and less messy."
                          className="w-full border border-black/10 bg-white px-4 py-4 outline-none"
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm uppercase tracking-[0.14em]">
                          Image URL
                        </label>
                        <input
                          value={review.imageUrl}
                          onChange={(e) =>
                            updateReview(review.id, "imageUrl", e.target.value)
                          }
                          placeholder="https://..."
                          className="w-full border border-black/10 bg-white px-4 py-4 outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm uppercase tracking-[0.14em]">
                          Source
                        </label>
                        <input
                          value={review.source}
                          onChange={(e) =>
                            updateReview(review.id, "source", e.target.value)
                          }
                          placeholder="online reviews"
                          className="w-full border border-black/10 bg-white px-4 py-4 outline-none"
                        />
                      </div>

                      <div className="flex items-end">
                        <label className="flex min-h-[56px] w-full items-center gap-3 border border-black/10 bg-white px-4 py-4 text-sm uppercase tracking-[0.14em]">
                          <input
                            type="checkbox"
                            checked={review.verified}
                            onChange={(e) =>
                              updateReview(
                                review.id,
                                "verified",
                                e.target.checked,
                              )
                            }
                            className="h-4 w-4"
                          />
                          Verified
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="border border-black/10 bg-white p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                  Extra
                </p>
                <h2 className="mt-2 text-2xl font-medium">Size guide</h2>
              </div>

              <label className="flex items-center gap-3 text-sm uppercase tracking-[0.14em]">
                <input
                  type="checkbox"
                  name="sizeGuideEnabled"
                  checked={hasSizeGuide}
                  onChange={(e) => setHasSizeGuide(e.target.checked)}
                />
                Enable
              </label>
            </div>

            {hasSizeGuide ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="sizeGuideTitle"
                    className="text-sm uppercase tracking-[0.14em]"
                  >
                    Title
                  </label>
                  <input
                    id="sizeGuideTitle"
                    name="sizeGuideTitle"
                    defaultValue={initialData?.sizeGuideTitle ?? "Size guide"}
                    placeholder="Size guide"
                    className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="sizeGuideContent"
                    className="text-sm uppercase tracking-[0.14em]"
                  >
                    Content
                  </label>
                  <textarea
                    id="sizeGuideContent"
                    name="sizeGuideContent"
                    rows={8}
                    defaultValue={initialData?.sizeGuideContent ?? ""}
                    placeholder={`XS - Chest 80–86 cm
S - Chest 87–93 cm
M - Chest 94–100 cm
L - Chest 101–107 cm`}
                    className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                  />
                </div>
              </div>
            ) : null}
          </section>

          <section className="border border-black/10 bg-white p-6">
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                Media
              </p>
              <h2 className="mt-2 text-2xl font-medium">Images</h2>
            </div>

            <div className="space-y-4">
              {images.map((image, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    value={image}
                    onChange={(e) => updateImage(index, e.target.value)}
                    placeholder="/products/dog-bed-1.jpg"
                    className="flex-1 border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={images.length === 1}
                    className="border border-black/10 px-4 py-4 text-sm uppercase tracking-[0.14em] disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addImage}
                className="border border-black/10 px-5 py-3 text-sm uppercase tracking-[0.14em]"
              >
                Add image
              </button>
            </div>
          </section>

          <section className="border border-black/10 bg-white p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                  Variants
                </p>
                <h2 className="mt-2 text-2xl font-medium">Product options</h2>
              </div>

              <label className="flex items-center gap-3 text-sm uppercase tracking-[0.14em]">
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setHasVariants(checked);

                    if (!checked) {
                      setVariants([]);
                    }
                  }}
                />
                Has variants
              </label>
            </div>

            {hasVariants ? (
              <div className="space-y-8">
                <div className="space-y-6">
                  {optionGroups.map((group) => (
                    <div
                      key={group.id}
                      className="space-y-4 border border-black/10 bg-[#f6f1e8] p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <label className="text-sm uppercase tracking-[0.14em]">
                            Option name
                          </label>
                          <input
                            value={group.name}
                            onChange={(e) =>
                              updateOptionGroupName(group.id, e.target.value)
                            }
                            placeholder="Color"
                            className="w-full border border-black/10 bg-white px-4 py-4 outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeOptionGroup(group.id)}
                          disabled={optionGroups.length === 1}
                          className="border border-black/10 px-4 py-3 text-sm uppercase tracking-[0.14em] disabled:opacity-40"
                        >
                          Remove group
                        </button>
                      </div>

                      <div className="space-y-3">
                        {group.values.map((value, valueIndex) => (
                          <div key={valueIndex} className="flex gap-3">
                            <input
                              value={value}
                              onChange={(e) =>
                                updateOptionValue(
                                  group.id,
                                  valueIndex,
                                  e.target.value,
                                )
                              }
                              placeholder="Black"
                              className="flex-1 border border-black/10 bg-white px-4 py-4 outline-none"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeOptionValue(group.id, valueIndex)
                              }
                              disabled={group.values.length === 1}
                              className="border border-black/10 px-4 py-4 text-sm uppercase tracking-[0.14em] disabled:opacity-40"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => addOptionValue(group.id)}
                        className="border border-black/10 px-4 py-3 text-sm uppercase tracking-[0.14em]"
                      >
                        Add value
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={addOptionGroup}
                    className="border border-black/10 px-5 py-3 text-sm uppercase tracking-[0.14em]"
                  >
                    Add option group
                  </button>

                  <button
                    type="button"
                    onClick={generateVariants}
                    className="border border-black bg-black px-5 py-3 text-sm uppercase tracking-[0.14em] text-[#f6f1e8]"
                  >
                    Generate variants
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                      Generated
                    </p>
                    <h3 className="mt-2 text-xl font-medium">Variant list</h3>
                  </div>

                  {variants.length === 0 ? (
                    <p className="text-sm text-black/55">
                      Add option groups and values, then click generate
                      variants.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {variants.map((variant, variantIndex) => (
                        <div
                          key={`${variant.name}-${variantIndex}`}
                          className="grid gap-4 border border-black/10 bg-[#f6f1e8] p-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]"
                        >
                          <div className="space-y-2">
                            <label className="text-sm uppercase tracking-[0.14em]">
                              Variant
                            </label>
                            <input
                              value={variant.name}
                              onChange={(e) =>
                                updateGeneratedVariant(
                                  variantIndex,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="w-full border border-black/10 bg-white px-4 py-4 outline-none"
                            />
                            <p className="text-xs text-black/45">
                              {variant.options
                                .map(
                                  (option) => `${option.name}: ${option.value}`,
                                )
                                .join(" · ")}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm uppercase tracking-[0.14em]">
                              Price override
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={variant.price}
                              onChange={(e) =>
                                updateGeneratedVariant(
                                  variantIndex,
                                  "price",
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value),
                                )
                              }
                              placeholder="Optional"
                              className="w-full border border-black/10 bg-white px-4 py-4 outline-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm uppercase tracking-[0.14em]">
                              Availability
                            </label>
                            <select
                              value={variant.stock}
                              onChange={(e) =>
                                updateGeneratedVariant(
                                  variantIndex,
                                  "stock",
                                  Number(e.target.value),
                                )
                              }
                              className="w-full border border-black/10 bg-white px-4 py-4 outline-none"
                            >
                              <option value={1}>In stock</option>
                              <option value={0}>Out of stock</option>
                            </select>
                          </div>

                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() =>
                                removeGeneratedVariant(variantIndex)
                              }
                              className="border border-black/10 px-4 py-4 text-sm uppercase tracking-[0.14em]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-black/55">
                This product will use the base price and stock only.
              </p>
            )}
          </section>
        </div>

        <div className="space-y-10">
          <section className="border border-black/10 bg-white p-6">
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                Pricing
              </p>
              <h2 className="mt-2 text-2xl font-medium">Inventory</h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="text-sm uppercase tracking-[0.14em]"
                >
                  Base price (cents)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  required
                  defaultValue={initialData?.price ?? ""}
                  className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="compareAtPrice"
                  className="text-sm uppercase tracking-[0.14em]"
                >
                  Compare at price (cents)
                </label>
                <input
                  id="compareAtPrice"
                  name="compareAtPrice"
                  type="number"
                  min="0"
                  defaultValue={initialData?.compareAtPrice ?? ""}
                  className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="stock"
                  className="text-sm uppercase tracking-[0.14em]"
                >
                  Base availability
                </label>
                <select
                  id="stock"
                  name="stock"
                  defaultValue={initialData?.stock ? 1 : 0}
                  className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                >
                  <option value={1}>In stock</option>
                  <option value={0}>Out of stock</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="categoryId"
                  className="text-sm uppercase tracking-[0.14em]"
                >
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  required
                  defaultValue={initialData?.categoryId ?? ""}
                  className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.14em]">Tags</p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {tags.map((tag) => {
                    const checked = !!initialData?.tags.some(
                      (item) => item.id === tag.id,
                    );

                    return (
                      <label
                        key={tag.id}
                        className="flex items-center gap-3 border border-black/10 bg-[#f6f1e8] px-4 py-3"
                      >
                        <input
                          type="checkbox"
                          name="tagIds"
                          value={tag.id}
                          defaultChecked={checked}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">{tag.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm uppercase tracking-[0.14em]">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={initialData?.featured ?? false}
                  className="h-4 w-4"
                />
                Featured product
              </label>
            </div>
          </section>

          <section className="border border-black/10 bg-white p-6">
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                SEO
              </p>
              <h2 className="mt-2 text-2xl font-medium">Search metadata</h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="seoTitle"
                  className="text-sm uppercase tracking-[0.14em]"
                >
                  SEO title
                </label>
                <input
                  id="seoTitle"
                  name="seoTitle"
                  defaultValue={initialData?.seoTitle ?? ""}
                  placeholder="Orthopedic Dog Bed | Petsaco"
                  className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="seoDescription"
                  className="text-sm uppercase tracking-[0.14em]"
                >
                  SEO description
                </label>
                <textarea
                  id="seoDescription"
                  name="seoDescription"
                  rows={4}
                  defaultValue={initialData?.seoDescription ?? ""}
                  placeholder="Premium orthopedic dog bed with soft support, durable materials and easy-care design."
                  className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                />
              </div>
            </div>
          </section>

          <section className="border border-black/10 bg-white p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
              Save
            </p>

            {state.error ? (
              <p className="mt-4 text-sm text-red-600">{state.error}</p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="mt-6 inline-flex w-full items-center justify-center border border-black bg-black px-7 py-4 text-sm uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black disabled:opacity-50"
            >
              {pending
                ? "Saving..."
                : isEdit
                  ? "Update product"
                  : "Create product"}
            </button>
          </section>
        </div>
      </div>
    </form>
  );
}

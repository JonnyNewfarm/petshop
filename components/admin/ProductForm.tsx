"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/product-actions";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type GeneratedVariant = {
  name: string;
  price: number | "";
  stock: number | "";
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

type Tag = {
  id: string;
  name: string;
  slug: string;
};

type ProductFormInitialData = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  featured: boolean;
  categoryId: string;
  tags: {
    id: string;
  }[];
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

export default function ProductForm({
  categories,
  initialData,
  tags,
}: {
  tags: Tag[];
  categories: Category[];
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
          stock: variant.stock,
          options: variant.options,
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
          stock: existing?.stock ?? "",
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
        stock: variant.stock === "" ? 0 : Number(variant.stock),
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

  return (
    <form action={formAction} className="space-y-10">
      {isEdit ? (
        <input type="hidden" name="productId" value={initialData.id} />
      ) : null}

      <input type="hidden" name="imageUrls" value={serializedImageUrls} />
      <input type="hidden" name="variantsJson" value={serializedVariants} />

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
            </div>
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
                              Stock
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={variant.stock}
                              onChange={(e) =>
                                updateGeneratedVariant(
                                  variantIndex,
                                  "stock",
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value),
                                )
                              }
                              className="w-full border border-black/10 bg-white px-4 py-4 outline-none"
                            />
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
                  htmlFor="stock"
                  className="text-sm uppercase tracking-[0.14em]"
                >
                  Base stock
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  required
                  defaultValue={initialData?.stock ?? ""}
                  className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
                />
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

"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  buildProduct,
  colorsToText,
  generateSku,
  productSchema,
  splitLines,
  textToColors,
  type ProductValues,
} from "@/features/admin/data/adminSchemas";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@/components/shared/components/icons";
import type { ColorOption, Product } from "@/lib/types";
import { ColorListEditor } from "./ColorListEditor";
import { ImageManager } from "./ImageManager";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-ink-950";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600";

function toFormValues(product?: Product, products: Product[] = []): ProductValues {
  if (!product) {
    return {
      name: "",
      sku: generateSku(products),
      category: "t-shirts",
      price: 0,
      salePrice: undefined,
      stock: 0,
      description: "",
      details: "",
      sizes: "S\nM\nL\nXL\nXXL",
      images: "",
      colors: "Black #111318\nWhite #f4f4f4",
      features: false,
      isBestSeller: false,
      isNew: true,
    };
  }
  return {
    name: product.name,
    sku: product.sku,
    category: product.category,
    price: product.price,
    salePrice: product.salePrice,
    stock: product.stock,
    description: product.description,
    details: product.details.join("\n"),
    sizes: product.sizes.join("\n"),
    images: product.images.join("\n"),
    colors: colorsToText(product.colors),
    features: Boolean(product.featured),
    isBestSeller: Boolean(product.isBestSeller),
    isNew: Boolean(product.isNew),
  };
}

export function ProductForm({
  product,
  products,
  onSubmit,
  onCancel,
}: {
  product?: Product;
  products: Product[];
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}) {
  const { categories } = useStore();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductValues>({
    resolver: yupResolver(productSchema),
    defaultValues: toFormValues(product, products),
  });
  const skuValue = watch("sku");
  const currentImages = splitLines(watch("images"));
  const setImages = (arr: string[]) =>
    setValue("images", arr.join("\n"), { shouldValidate: true });
  const colorOptions = textToColors(watch("colors"));
  const setColorOptions = (arr: ColorOption[]) =>
    setValue("colors", colorsToText(arr), { shouldValidate: true });

  const submit = (values: ProductValues) => {
    onSubmit(buildProduct(values, products, product));
    reset(toFormValues(product, products));
  };

  const fieldError = (key: keyof ProductValues) =>
    errors[key] ? (
      <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
        {errors[key]?.message}
      </p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-ink-200/60"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950">
          {product ? `Edit ${product.name}` : "Add Product"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-ink-200 px-4 py-1.5 text-xs font-bold text-ink-700 transition hover:border-ink-950"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Name *</label>
          <input className={cn(inputCls, errors.name && "border-red-400")} {...register("name")} />
          {fieldError("name")}
        </div>
        <div>
          <label className={labelCls}>SKU *</label>
          <input
            readOnly
            value={skuValue}
            onFocus={(e) => e.target.select()}
            className={cn(inputCls, "bg-ink-50 font-mono text-xs font-bold")}
          />
          <p className="mt-1 flex items-center gap-1 text-xs text-emerald-700">
            <CheckIcon className="h-3.5 w-3.5" />
            Auto-generated, date + serial, always unique.
          </p>
        </div>
        <div>
          <label className={labelCls}>Category *</label>
          <select className={cn(inputCls, errors.category && "border-red-400")} {...register("category")}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          {fieldError("category")}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Price *</label>
            <input className={cn(inputCls, errors.price && "border-red-400")} {...register("price")} />
            {fieldError("price")}
          </div>
          <div>
            <label className={labelCls}>Sale</label>
            <input className={cn(inputCls, errors.salePrice && "border-red-400")} {...register("salePrice")} />
            {fieldError("salePrice")}
          </div>
          <div>
            <label className={labelCls}>Stock *</label>
            <input className={cn(inputCls, errors.stock && "border-red-400")} {...register("stock")} />
            {fieldError("stock")}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Description *</label>
          <textarea
            rows={3}
            className={cn(inputCls, "resize-none", errors.description && "border-red-400")}
            {...register("description")}
          />
          {fieldError("description")}
        </div>
        <div>
          <label className={labelCls}>Details (one per line)</label>
          <textarea rows={4} className={cn(inputCls, "resize-none")} {...register("details")} />
        </div>
        <div>
          <label className={labelCls}>Sizes (one per line) *</label>
          <textarea rows={4} className={cn(inputCls, "resize-none", errors.sizes && "border-red-400")} {...register("sizes")} />
          {fieldError("sizes")}
        </div>
        <div className="sm:col-span-2">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-600">
            <span>Product images *</span>
            {errors.images && (
              <span className="font-semibold normal-case text-red-600">
                {errors.images.message}
              </span>
            )}
          </div>
          <ImageManager images={currentImages} onChange={setImages} />
          <p className="mt-1.5 text-xs text-ink-400">
            The first image is the card image and main slider image. You can add
            up to {10} images for the single product slider.
          </p>
        </div>
        <div className="sm:col-span-2">
          <ColorListEditor
            colors={colorOptions}
            onChange={setColorOptions}
            label="Product colors"
            error={errors.colors?.message}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-5 text-sm font-semibold text-ink-800">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("features")} className="h-4 w-4 accent-ink-950" />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isBestSeller")} className="h-4 w-4 accent-ink-950" />
          Best Seller
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isNew")} className="h-4 w-4 accent-ink-950" />
          New Arrival
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-ink-950 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : product ? "Save Changes" : "Add Product"}
      </button>
    </form>
  );
}
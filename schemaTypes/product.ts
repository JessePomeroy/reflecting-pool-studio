/**
 * Product Schema
 *
 * Defines the structure for shop products.
 * Products have images, pricing, and inventory status.
 *
 * Used on: /shop, /shop/[slug]
 */

import { defineField, defineType } from "sanity";
import { PRODUCT_CATEGORIES } from "./shared/categoryOptions";
import { seoFields } from "./shared/seoFields";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",

  groups: [
    { name: "content", title: "Content", default: true },
    { name: "pricing", title: "Pricing" },
    { name: "digital", title: "Digital" },
    { name: "settings", title: "Settings" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    defineField({
      name: "orderRank",
      title: "Order Rank",
      type: "string",
      hidden: true,
    }),

    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description:
        "URL path for this page — auto-generated from the title. Only edit if you need a custom URL.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "images",
      title: "Images",
      type: "array",
      group: "content",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
          ],
        },
      ],
      options: {
        layout: "grid",
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "content",
      description: "Product details, materials, dimensions, etc.",
    }),

    defineField({
      name: "price",
      title: "Price",
      type: "number",
      group: "pricing",
      validation: (rule) => rule.positive(),
      description: "Base price in USD.",
    }),

    defineField({
      name: "category",
      title: "Category",
      group: "pricing",
      type: "string",
      options: {
        list: PRODUCT_CATEGORIES,
      },
    }),

    defineField({
      name: "collection",
      title: "Print Collection",
      type: "reference",
      group: "settings",
      to: [{ type: "printCollection" }],
      hidden: ({ parent }) => parent?.category !== "prints",
      description: "Link this print to a collection (shown on /shop/prints/[slug])",
    }),

    defineField({
      name: "digitalFile",
      title: "Digital Download File",
      type: "file",
      group: "digital",
      description: "Upload the zip/file buyers will download after purchase",
      hidden: ({ parent }) => parent?.category !== "digital",
      options: {
        accept: ".zip,.tar.gz,.css,.js",
      },
    }),

    defineField({
      name: "digitalFileVersion",
      title: "Version",
      type: "string",
      group: "digital",
      description: 'e.g., "1.0.0" - shown to buyers so they know if there are updates',
      hidden: ({ parent }) => parent?.category !== "digital",
    }),

    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      group: "settings",
      initialValue: true,
      description: "Uncheck to show 'Sold Out' on the site.",
    }),

    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "settings",
      initialValue: false,
      description: "Highlight this product?",
    }),

    ...seoFields,
  ],

  preview: {
    select: {
      title: "title",
      media: "images.0.asset",
      price: "price",
      category: "category",
      inStock: "inStock",
    },
    prepare({ title, media, price, category, inStock }) {
      const priceText = typeof price === "number" ? `$${price}` : "No price set";
      const parts = [priceText];
      if (category) parts.push(category);
      if (inStock === false) parts.push("sold out");
      return { title, media, subtitle: parts.join(" · ") };
    },
  },
});

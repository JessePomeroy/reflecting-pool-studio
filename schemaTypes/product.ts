/**
 * Product Schema
 *
 * Defines the structure for shop products.
 * Products have images, pricing, and inventory status.
 *
 * Used on: /shop, /shop/[slug]
 */

import { defineField, defineType } from "sanity";
import { PAPER_DROPDOWN_OPTIONS, SIZE_DROPDOWN_OPTIONS } from "./constants/lumaprintsCatalog";

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
      description: "Base price in USD. Optional if paper-specific prices are set.",
    }),

    defineField({
      name: "category",
      title: "Category",
      group: "pricing",
      type: "string",
      options: {
        list: [
          { title: "Prints", value: "prints" },
          { title: "Postcards", value: "postcards" },
          { title: "Tapestries", value: "tapestries" },
          { title: "Digital", value: "digital" },
          { title: "Merchandise", value: "merchandise" },
        ],
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
      name: "fulfillmentType",
      title: "Fulfillment Type",
      type: "string",
      group: "pricing",
      options: {
        list: [
          { title: "LumaPrints", value: "lumaprints" },
          { title: "Self-fulfilled", value: "self" },
        ],
      },
      initialValue: "self",
      description:
        "LumaPrints = auto-submit when order is placed. Self = handle fulfillment manually.",
    }),

    defineField({
      name: "availablePapers",
      title: "Available Paper Types",
      type: "array",
      group: "pricing",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Size & Paper",
              type: "string",
              options: {
                list: PAPER_DROPDOWN_OPTIONS.flatMap((paper) =>
                  SIZE_DROPDOWN_OPTIONS.map((size) => ({
                    title: `${paper.title} ${size.title}`,
                    value: `${paper.value}|${size.value}`,
                  })),
                ),
              },
            },
            {
              name: "price",
              title: "Price (USD)",
              type: "number",
              description: "Price for this paper type and size. Overrides the base product price.",
              validation: (rule: any) => rule.required().positive(),
            },
          ],
          preview: {
            select: {
              name: "name",
              price: "price",
            },
            prepare(value: any) {
              const name = value?.name?.split("|")[0] || "Paper option";
              const price = value?.price;
              return {
                title: name,
                subtitle: price ? `$${price}` : "No price set",
              };
            },
          },
        },
      ],
      options: {
        modal: { type: "popover" },
      },
      hidden: ({ parent }) => parent?.fulfillmentType !== "lumaprints",
      description: "Add paper options. All sizes are 2:3 ratio for your images.",
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

    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        {
          name: "description",
          title: "Meta Description",
          type: "text",
          rows: 3,
          description:
            "Shows in Google search results under the page title. Keep under 160 characters.",
          validation: (rule: any) => rule.max(160),
        },
        {
          name: "ogImage",
          title: "Social Image",
          type: "image",
          description: "Override for social sharing (defaults to first product image)",
        },
      ],
    }),
  ],

  // Preview in document lists shows title, thumbnail, price, and category.
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

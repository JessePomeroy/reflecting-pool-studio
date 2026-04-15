import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";
import { seoFields } from "./shared/seoFields";

export const gallery = defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",

  groups: [
    { name: "content", title: "Content", default: true },
    { name: "details", title: "Details" },
    { name: "settings", title: "Settings" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    // Query with: | order(orderRank)
    orderRankField({ type: "gallery" }),

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
      description: "Drag multiple files from Finder to batch upload.",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Describes the image for screen readers and SEO",
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
      rows: 3,
      group: "content",
      description: "Brief description of this gallery",
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Portrait", value: "portrait" },
          { title: "Landscape", value: "landscape" },
          { title: "Street", value: "street" },
          { title: "Abstract", value: "abstract" },
          { title: "Editorial", value: "editorial" },
        ],
      },
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "date",
      title: "Date",
      type: "date",
      group: "details",
      description: "When was this gallery created/shot?",
    }),

    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "settings",
      initialValue: false,
      description: "Show this gallery on the homepage?",
    }),

    defineField({
      name: "isVisible",
      title: "Visible on Site",
      type: "boolean",
      group: "settings",
      initialValue: true,
      description: "Uncheck to hide this gallery from the public site",
    }),

    ...seoFields,
  ],

  preview: {
    select: {
      title: "title",
      media: "images.0.asset",
      images: "images",
      category: "category",
    },
    prepare({ title, media, images, category }) {
      const count = Array.isArray(images) ? images.length : 0;
      const countText = count === 0 ? "No images yet" : `${count} image${count === 1 ? "" : "s"}`;
      const subtitle = category ? `${countText} · ${category}` : countText;
      return { title, media, subtitle };
    },
  },
});

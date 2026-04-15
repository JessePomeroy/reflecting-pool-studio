/**
 * Gallery Schema
 *
 * Defines the structure for photo galleries in the CMS.
 * Galleries can be reordered via drag-and-drop in the Studio.
 *
 * Used on: /gallery, /gallery/[slug]
 */

import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export const gallery = defineType({
  // API name — used in GROQ queries: *[_type == "gallery"]
  name: "gallery",
  // Display name in Studio UI
  title: "Gallery",
  // Document type (as opposed to 'object' which is embedded)
  type: "document",

  groups: [
    { name: "content", title: "Content", default: true },
    { name: "details", title: "Details" },
    { name: "settings", title: "Settings" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    // Hidden field that stores the sort order for drag-and-drop
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
            hotspot: true, // Enables focal point cropping in Studio
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
        layout: "grid", // Display as grid instead of list in Studio
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
          description: "Override for social sharing (defaults to first gallery image)",
        },
      ],
    }),
  ],

  // How this document appears in lists in the Studio
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

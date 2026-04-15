/**
 * Print Collection Schema
 *
 * Hierarchical grouping of prints. Collections can be nested
 * via the optional `parent` reference (e.g., "Film Photography" → "35mm").
 *
 * Top-level collections (no parent) appear on the main shop page under Prints.
 * Nested collections appear inside their parent's detail page.
 *
 * Used on: /shop (top-level), /shop/prints/[slug] (detail + nested)
 */

import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export const printCollection = defineType({
  name: "printCollection",
  title: "Print Collection",
  type: "document",

  groups: [
    { name: "content", title: "Content", default: true },
    { name: "settings", title: "Settings" },
  ],

  fields: [
    orderRankField({ type: "printCollection" }),

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
      name: "parent",
      title: "Parent Collection",
      type: "reference",
      group: "settings",
      to: [{ type: "printCollection" }],
      description:
        "Leave empty for top-level collections. Reference a parent to nest this collection.",
    }),

    defineField({
      name: "previewImage",
      title: "Preview Image",
      type: "image",
      group: "content",
      description: "Cover image shown in shop listings and collection pages.",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
        },
      ],
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: "content",
    }),

    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "previewImage",
      description: "description",
      parentTitle: "parent.title",
      featured: "featured",
    },
    prepare({ title, media, description, parentTitle, featured }) {
      const parts: string[] = [];
      if (parentTitle) parts.push(`↳ ${parentTitle}`);
      else parts.push("Top-level");
      if (featured) parts.push("★ Featured");
      if (description) parts.push(description);
      return { title, media, subtitle: parts.join(" · ") };
    },
  },
});

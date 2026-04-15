/**
 * About Schema
 *
 * Defines the structure for the About page content.
 * This is typically a singleton (one document) containing
 * bio information, portrait, and social links.
 *
 * Used on: /about
 */

import { defineField, defineType } from "sanity";

export const about = defineType({
  // API name — used in GROQ queries: *[_type == "about"][0]
  name: "about",
  title: "About",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    // Role or title displayed under name
    defineField({
      name: "title",
      title: "Title/Role",
      type: "string",
      description: 'e.g., "Photographer" or "Multidisciplinary Artist"',
    }),

    // Portrait photo for the about page
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: {
        hotspot: true, // Enable focal point for cropping
      },
    }),

    // Short bio for display on the page
    defineField({
      name: "shortBio",
      title: "Short Bio",
      type: "text",
      rows: 3,
      description: "Brief intro, 2-3 sentences",
    }),

    // Full bio using Portable Text (rich text with formatting)
    defineField({
      name: "fullBio",
      title: "Full Bio",
      type: "array",
      of: [{ type: "block" }], // Portable Text blocks
      description: "Longer bio with formatting (optional)",
    }),

    // Social links grouped as an object
    defineField({
      name: "social",
      title: "Social Links",
      type: "object",
      fields: [
        {
          name: "instagram",
          title: "Instagram URL",
          type: "url",
        },
        {
          name: "twitter",
          title: "Twitter URL",
          type: "url",
        },
        {
          name: "email",
          title: "Email",
          type: "string",
          description: "Contact email address",
        },
      ],
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        {
          name: "description",
          title: "Meta Description",
          type: "text",
          rows: 3,
          validation: (rule: any) => rule.max(160),
        },
        {
          name: "ogImage",
          title: "Social Image",
          type: "image",
        },
      ],
    }),
  ],

  // Preview shows name and portrait
  preview: {
    select: {
      title: "name",
      media: "portrait",
    },
  },
});

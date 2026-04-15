import { defineField, defineType } from "sanity";

/** Blog post schema with template support (standard, caseStudy, behindTheScenes, technical, clientStory). */

export default defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "postType",
      title: "Post Type",
      type: "string",
      options: {
        list: [
          { title: "Standard Post", value: "standard" },
          { title: "Case Study", value: "caseStudy" },
          { title: "Behind the Scenes", value: "behindTheScenes" },
          { title: "Technical Write-up", value: "technical" },
          { title: "Client Story", value: "clientStory" },
        ],
        layout: "radio",
      },
      initialValue: "standard",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),

    // --- Template-Specific Fields ---

    // Case Study & Client Story fields
    defineField({
      name: "brief",
      title: "The Brief",
      type: "text",
      rows: 3,
      description: "What the client needed or what you wanted to explore",
      hidden: ({ document }) =>
        !["caseStudy", "clientStory"].includes(document?.postType as string),
    }),
    defineField({
      name: "approach",
      title: "The Approach",
      type: "text",
      rows: 4,
      description: "Your creative direction, gear choices, film stocks used",
      hidden: ({ document }) =>
        !["caseStudy", "clientStory"].includes(document?.postType as string),
    }),
    defineField({
      name: "result",
      title: "The Result",
      type: "text",
      rows: 3,
      description: "Final delivery or personal reflection",
      hidden: ({ document }) =>
        !["caseStudy", "clientStory"].includes(document?.postType as string),
    }),

    // Technical Write-up fields
    defineField({
      name: "gearUsed",
      title: "Gear Used",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "camera", type: "string", title: "Camera" },
            { name: "lens", type: "string", title: "Lens" },
            { name: "filmStock", type: "string", title: "Film Stock" },
            { name: "developer", type: "string", title: "Developer" },
          ],
          preview: {
            select: {
              camera: "camera",
              lens: "lens",
              filmStock: "filmStock",
            },
            prepare({ camera, lens, filmStock }) {
              return { title: [camera, lens, filmStock].filter(Boolean).join(" • ") };
            },
          },
        },
      ],
      hidden: ({ document }) => document?.postType !== "technical",
    }),

    // Common fields
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
      postType: "postType",
      publishedAt: "publishedAt",
    },
    prepare({ title, author, media, postType, publishedAt }) {
      const typeLabel =
        postType === "caseStudy"
          ? "Case Study"
          : postType === "behindTheScenes"
            ? "BTS"
            : postType === "technical"
              ? "Technical"
              : postType === "clientStory"
                ? "Client Story"
                : null;
      const dateStr = publishedAt
        ? new Date(publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Draft";
      const parts = [dateStr];
      if (author) parts.push(`by ${author}`);
      if (typeLabel) parts.push(typeLabel);
      return { title, media, subtitle: parts.join(" · ") };
    },
  },
});

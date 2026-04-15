import { defineField } from "sanity";

export const seoFields = [
  defineField({
    name: "seo",
    title: "SEO",
    type: "object",
    group: "seo",
    fields: [
      defineField({
        name: "description",
        title: "Meta Description",
        type: "text",
        rows: 3,
        description: "Recommended: 50-160 characters.",
        validation: (rule: any) => rule.max(160),
      }),
      defineField({
        name: "ogImage",
        title: "Social Sharing Image",
        type: "image",
        description: "Used when shared on social media. Recommended: 1200x630.",
      }),
    ],
  }),
];

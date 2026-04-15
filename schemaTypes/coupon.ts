/**
 * Coupon Schema
 *
 * Discount codes applied at checkout. Validated server-side in the checkout API.
 *
 * Coupons are stored in Sanity (not Stripe) because products use dynamic
 * `price_data` in Stripe, which doesn't support Stripe's native coupon system.
 * Discounts are calculated server-side and applied to `unit_amount` before
 * creating the Stripe checkout session.
 *
 * Supports:
 * - Percentage or fixed-amount discounts
 * - Category restrictions (e.g., tapestries only)
 * - Product-specific restrictions (references to product documents)
 * - Usage limits with automatic tracking
 */

import { defineField, defineType } from "sanity";
import { PRODUCT_CATEGORIES } from "./shared/categoryOptions";

export const coupon = defineType({
  name: "coupon",
  title: "Coupon",
  type: "document",

  fields: [
    defineField({
      name: "code",
      title: "Coupon Code",
      type: "string",
      validation: (rule) => rule.required().uppercase(),
      description: "The code customers enter at checkout (will be converted to uppercase)",
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description: 'Internal description (e.g., "20% off tapestries")',
    }),

    defineField({
      name: "discountType",
      title: "Discount Type",
      type: "string",
      options: {
        list: [
          { title: "Percentage", value: "percent" },
          { title: "Fixed Amount", value: "fixed" },
        ],
      },
      initialValue: "percent",
    }),

    defineField({
      name: "discountValue",
      title: "Discount Value",
      type: "number",
      validation: (rule) => rule.required().positive(),
      description: "Percentage (e.g., 20) or fixed amount in dollars (e.g., 10)",
    }),

    defineField({
      name: "allowedCategories",
      title: "Allowed Categories",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: PRODUCT_CATEGORIES,
      },
      description: "Leave empty to allow all categories, or select specific categories",
    }),

    defineField({
      name: "allowedProducts",
      title: "Allowed Products",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
      description: "Optional: restrict to specific products. Overrides allowedCategories if set.",
    }),

    defineField({
      name: "maxUses",
      title: "Max Uses",
      type: "number",
      description: "Maximum number of times this coupon can be used. Leave empty for unlimited.",
    }),

    defineField({
      name: "currentUses",
      title: "Current Uses",
      type: "number",
      initialValue: 0,
      readOnly: true,
      description: "Track usage (updated automatically on checkout)",
    }),

    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Disable to prevent the coupon from being used",
    }),
  ],

  preview: {
    select: {
      title: "code",
      subtitle: "description",
    },
  },
});

/**
 * LumaPrints Catalog — wholesale costs and product metadata for Shop V2.
 *
 * Source of truth for what LumaPrints sells, what we call it, and what it
 * costs us wholesale. The custom field component RetailPriceWithMargin reads
 * from this file to display wholesale cost + computed margin next to the
 * photographer's retail price input in Sanity Studio.
 *
 * Each photographer client studio bundles this file via template updates.
 * To update wholesale costs across all client studios, update this file in
 * every studio repo.
 *
 * Cost data sourced from the LumaPrints partner reference doc at
 * `~/Documents/quilt/02_reference/lumaprints-api-reference.md`.
 *
 * Catalog availability verified 2026-04-10 against the LumaPrints production
 * shipping pricing API via `scripts/verify-lumaprints-catalog.ts`
 * — all 7 papers × 27 sizes = 189 combinations are accepted by the API.
 * Only the 54 combinations with published wholesale costs are seeded here
 * (9 sizes × 6 papers). Add more as cost data becomes available — no schema
 * changes required, just extend `LUMA_PAPERS`, `LUMA_SIZES`, and
 * `LUMA_WHOLESALE_COSTS` arrays.
 *
 * Excluded papers:
 * - Metallic (103006): excluded per spec note Q1 (audit #23)
 * - Semi-Matte (103008): pending wholesale cost data
 *
 * Excluded sizes (pending cost data): 8×8, 8.5×11, 8×12, 10×10, 11×17,
 * 12×12, 12×16, 12×24, 12×36, 16×16, 16×24, 16×32, 20×20, 20×60, 24×24,
 * 24×30, 30×30, 30×60, 40×40
 */

export interface LumaPaper {
  /** LumaPrints subcategory ID, used in order submission */
  subcategoryId: number;
  /** URL-safe stable identifier, used as the dropdown value */
  slug: string;
  /** Display name shown in dropdowns and shop UI */
  name: string;
  /** Paper weight in grams per square meter, or null if unspecified */
  gsm: number | null;
  /** Short description for product page tooltips */
  description: string;
}

export interface LumaSize {
  /** Print width in inches */
  width: number;
  /** Print height in inches */
  height: number;
  /** URL-safe stable identifier, used as the dropdown value */
  slug: string;
  /** Display label, e.g. "8×10" */
  label: string;
}

export interface LumaCatalogEntry {
  paperSlug: string;
  sizeSlug: string;
  /** Wholesale cost in USD */
  wholesaleCost: number;
}

/**
 * 6 Fine Art Paper types we currently have wholesale cost data for.
 */
export const LUMA_PAPERS: LumaPaper[] = [
  {
    subcategoryId: 103001,
    slug: "archival-matte",
    name: "Archival Matte",
    gsm: 230,
    description:
      "Bright white archival paper with a matte finish. Instant-dry, smudge-resistant, suited for everyday photo prints and gallery walls.",
  },
  {
    subcategoryId: 103007,
    slug: "glossy",
    name: "Glossy",
    gsm: 260,
    description:
      "Ultra-smooth high-gloss finish that delivers vibrant color and deep blacks. Best for landscapes, portraits, and high-contrast images.",
  },
  {
    subcategoryId: 103002,
    slug: "hot-press",
    name: "Hot Press",
    gsm: 330,
    description:
      "100% cotton rag fine art paper with a smooth, neutral white surface. Wide color gamut, archival-grade. A classic for fine art reproduction.",
  },
  {
    subcategoryId: 103003,
    slug: "cold-press",
    name: "Cold Press",
    gsm: 340,
    description:
      "100% cotton rag fine art paper with a heavily textured surface that mimics watercolor paper. Tactile, painterly, archival.",
  },
  {
    subcategoryId: 103005,
    slug: "semi-glossy-luster",
    name: "Semi-Glossy (Luster)",
    gsm: 250,
    description:
      "Resin-coated satin finish with no glare and no fingerprints. Industry-standard for portrait and event photography.",
  },
  {
    subcategoryId: 103009,
    slug: "somerset-velvet",
    name: "Somerset Velvet",
    gsm: 255,
    description:
      "100% cotton rag with a soft velvet surface and rich blacks. Premium fine art paper for galleries and collectors.",
  },
];

/**
 * 9 sizes we currently have wholesale cost data for. All verified accepted
 * by the LumaPrints API. 6×9 is a non-standard/custom size (not in LumaPrints'
 * standard 27) but is accepted and priced via the product pricing API.
 */
export const LUMA_SIZES: LumaSize[] = [
  { width: 4, height: 6, slug: "4x6", label: "4×6" },
  { width: 5, height: 7, slug: "5x7", label: "5×7" },
  { width: 6, height: 9, slug: "6x9", label: "6×9" },
  { width: 8, height: 10, slug: "8x10", label: "8×10" },
  { width: 11, height: 14, slug: "11x14", label: "11×14" },
  { width: 16, height: 20, slug: "16x20", label: "16×20" },
  { width: 24, height: 36, slug: "24x36", label: "24×36" },
  { width: 30, height: 40, slug: "30x40", label: "30×40" },
  { width: 40, height: 60, slug: "40x60", label: "40×60" },
];

/**
 * 6 papers × 9 sizes = 54 wholesale cost entries. 6×9 costs sourced from
 * the LumaPrints product pricing API on 2026-04-11; all other costs from
 * the partner reference doc (2026-04-10).
 */
export const LUMA_WHOLESALE_COSTS: LumaCatalogEntry[] = [
  // Archival Matte
  { paperSlug: "archival-matte", sizeSlug: "4x6", wholesaleCost: 1.71 },
  { paperSlug: "archival-matte", sizeSlug: "5x7", wholesaleCost: 2.01 },
  { paperSlug: "archival-matte", sizeSlug: "6x9", wholesaleCost: 2.53 },
  { paperSlug: "archival-matte", sizeSlug: "8x10", wholesaleCost: 3.19 },
  { paperSlug: "archival-matte", sizeSlug: "11x14", wholesaleCost: 5.01 },
  { paperSlug: "archival-matte", sizeSlug: "16x20", wholesaleCost: 8.89 },
  { paperSlug: "archival-matte", sizeSlug: "24x36", wholesaleCost: 21.1 },
  { paperSlug: "archival-matte", sizeSlug: "30x40", wholesaleCost: 28.44 },
  { paperSlug: "archival-matte", sizeSlug: "40x60", wholesaleCost: 54.43 },

  // Glossy
  { paperSlug: "glossy", sizeSlug: "4x6", wholesaleCost: 3.02 },
  { paperSlug: "glossy", sizeSlug: "5x7", wholesaleCost: 3.45 },
  { paperSlug: "glossy", sizeSlug: "6x9", wholesaleCost: 4.17 },
  { paperSlug: "glossy", sizeSlug: "8x10", wholesaleCost: 5.09 },
  { paperSlug: "glossy", sizeSlug: "11x14", wholesaleCost: 7.61 },
  { paperSlug: "glossy", sizeSlug: "16x20", wholesaleCost: 12.99 },
  { paperSlug: "glossy", sizeSlug: "24x36", wholesaleCost: 29.96 },
  { paperSlug: "glossy", sizeSlug: "30x40", wholesaleCost: 40.16 },
  { paperSlug: "glossy", sizeSlug: "40x60", wholesaleCost: 76.24 },

  // Hot Press
  { paperSlug: "hot-press", sizeSlug: "4x6", wholesaleCost: 2.86 },
  { paperSlug: "hot-press", sizeSlug: "5x7", wholesaleCost: 3.24 },
  { paperSlug: "hot-press", sizeSlug: "6x9", wholesaleCost: 3.87 },
  { paperSlug: "hot-press", sizeSlug: "8x10", wholesaleCost: 4.68 },
  { paperSlug: "hot-press", sizeSlug: "11x14", wholesaleCost: 6.9 },
  { paperSlug: "hot-press", sizeSlug: "16x20", wholesaleCost: 11.64 },
  { paperSlug: "hot-press", sizeSlug: "24x36", wholesaleCost: 26.55 },
  { paperSlug: "hot-press", sizeSlug: "30x40", wholesaleCost: 35.53 },
  { paperSlug: "hot-press", sizeSlug: "40x60", wholesaleCost: 67.31 },

  // Cold Press
  { paperSlug: "cold-press", sizeSlug: "4x6", wholesaleCost: 2.86 },
  { paperSlug: "cold-press", sizeSlug: "5x7", wholesaleCost: 3.24 },
  { paperSlug: "cold-press", sizeSlug: "6x9", wholesaleCost: 3.87 },
  { paperSlug: "cold-press", sizeSlug: "8x10", wholesaleCost: 4.68 },
  { paperSlug: "cold-press", sizeSlug: "11x14", wholesaleCost: 6.9 },
  { paperSlug: "cold-press", sizeSlug: "16x20", wholesaleCost: 11.64 },
  { paperSlug: "cold-press", sizeSlug: "24x36", wholesaleCost: 26.55 },
  { paperSlug: "cold-press", sizeSlug: "30x40", wholesaleCost: 35.53 },
  { paperSlug: "cold-press", sizeSlug: "40x60", wholesaleCost: 67.31 },

  // Semi-Glossy (Luster)
  { paperSlug: "semi-glossy-luster", sizeSlug: "4x6", wholesaleCost: 1.71 },
  { paperSlug: "semi-glossy-luster", sizeSlug: "5x7", wholesaleCost: 2.01 },
  { paperSlug: "semi-glossy-luster", sizeSlug: "6x9", wholesaleCost: 2.53 },
  { paperSlug: "semi-glossy-luster", sizeSlug: "8x10", wholesaleCost: 3.19 },
  { paperSlug: "semi-glossy-luster", sizeSlug: "11x14", wholesaleCost: 5.01 },
  { paperSlug: "semi-glossy-luster", sizeSlug: "16x20", wholesaleCost: 8.89 },
  { paperSlug: "semi-glossy-luster", sizeSlug: "24x36", wholesaleCost: 21.1 },
  { paperSlug: "semi-glossy-luster", sizeSlug: "30x40", wholesaleCost: 28.44 },
  { paperSlug: "semi-glossy-luster", sizeSlug: "40x60", wholesaleCost: 54.43 },

  // Somerset Velvet
  { paperSlug: "somerset-velvet", sizeSlug: "4x6", wholesaleCost: 3.02 },
  { paperSlug: "somerset-velvet", sizeSlug: "5x7", wholesaleCost: 3.45 },
  { paperSlug: "somerset-velvet", sizeSlug: "6x9", wholesaleCost: 4.17 },
  { paperSlug: "somerset-velvet", sizeSlug: "8x10", wholesaleCost: 5.09 },
  { paperSlug: "somerset-velvet", sizeSlug: "11x14", wholesaleCost: 7.61 },
  { paperSlug: "somerset-velvet", sizeSlug: "16x20", wholesaleCost: 12.99 },
  { paperSlug: "somerset-velvet", sizeSlug: "24x36", wholesaleCost: 29.96 },
  { paperSlug: "somerset-velvet", sizeSlug: "30x40", wholesaleCost: 40.16 },
  { paperSlug: "somerset-velvet", sizeSlug: "40x60", wholesaleCost: 76.24 },
];

/**
 * Frame wholesale costs by size. All colors within a thickness are
 * the same price. Queried from LumaPrints product pricing API 2026-04-12.
 */
export const FRAME_WHOLESALE_COSTS: Record<string, Record<string, number>> = {
  "0.875": {
    "4x6": 15.94,
    "5x7": 16.85,
    "6x9": 18.33,
    "8x10": 20.08,
    "11x14": 24.65,
    "16x20": 35.12,
    "24x36": 66.4,
    "30x40": 84.26,
    "40x60": 146.31,
  },
  "1.25": {
    "4x6": 16.35,
    "5x7": 17.34,
    "6x9": 18.94,
    "8x10": 20.8,
    "11x14": 25.66,
    "16x20": 36.58,
    "24x36": 68.84,
    "30x40": 87.12,
    "40x60": 150.37,
  },
};

/** Get the cheapest frame wholesale cost for a given size (0.875" frame). */
export function getFrameWholesaleCost(sizeSlug: string): number | null {
  return FRAME_WHOLESALE_COSTS["0.875"]?.[sizeSlug] ?? null;
}

/**
 * Canvas wholesale costs by thickness and size. Queried from LumaPrints
 * product pricing API 2026-04-12. Canvas starts at 8×10 (no small sizes).
 * Wrap is always Solid Black (option 3).
 */
export const CANVAS_WHOLESALE_COSTS: Record<string, Record<string, number>> = {
  "0.75": {
    "8x10": 9.89,
    "11x14": 12.09,
    "16x20": 24.35,
    "24x36": 39.56,
    "30x40": 66.85,
    "40x60": 120.12,
  },
  "1.25": {
    "8x10": 10.99,
    "11x14": 13.19,
    "16x20": 25.95,
    "24x36": 42.21,
    "30x40": 50.99,
    "40x60": 112.07,
  },
  "1.50": {
    "8x10": 12.09,
    "11x14": 14.29,
    "16x20": 30.73,
    "24x36": 50.19,
    "30x40": 60.29,
    "40x60": 131.03,
  },
  rolled: {
    "8x10": 9.13,
    "11x14": 12.2,
    "16x20": 14.92,
    "24x36": 24.8,
    "30x40": 32.83,
    "40x60": 51.51,
  },
};

/** Get canvas wholesale cost for a thickness + size combo. */
export function getCanvasWholesaleCost(thickness: string, sizeSlug: string): number | null {
  return CANVAS_WHOLESALE_COSTS[thickness]?.[sizeSlug] ?? null;
}

/** Sizes available for canvas (8×10 and up). */
export const CANVAS_AVAILABLE_SIZES = ["8x10", "11x14", "16x20", "24x36", "30x40", "40x60"];

/** Check if a paper slug is a canvas type. */
export function isCanvasPaper(paperSlug: string): boolean {
  return paperSlug.startsWith("canvas-");
}

/** Parse a canvas slug into its color and thickness. e.g. "canvas-black-0.75" → { color: "black", thickness: "0.75" } */
export function parseCanvasSlug(slug: string): { color: string; thickness: string } | null {
  const match = slug.match(/^canvas-(black|white)-(.+)$/);
  if (!match) return null;
  return { color: match[1], thickness: match[2] };
}

/** Look up wholesale cost by paper + size slug. Handles both papers and canvas. */
export function getWholesaleCost(paperSlug: string, sizeSlug: string): number | null {
  if (isCanvasPaper(paperSlug)) {
    const parsed = parseCanvasSlug(paperSlug);
    if (!parsed) return null;
    return getCanvasWholesaleCost(parsed.thickness, sizeSlug);
  }
  const entry = LUMA_WHOLESALE_COSTS.find(
    (e) => e.paperSlug === paperSlug && e.sizeSlug === sizeSlug,
  );
  return entry?.wholesaleCost ?? null;
}

/** Look up the full paper definition by slug. */
export function getPaperBySlug(slug: string): LumaPaper | null {
  return LUMA_PAPERS.find((p) => p.slug === slug) ?? null;
}

/** Look up the full size definition by slug. */
export function getSizeBySlug(slug: string): LumaSize | null {
  return LUMA_SIZES.find((s) => s.slug === slug) ?? null;
}

/** Canvas "paper" options — treated like papers in the variant system. */
export const CANVAS_OPTIONS = [
  { title: 'Canvas Black — 0.75" stretch', value: "canvas-black-0.75" },
  { title: 'Canvas Black — 1.25" stretch', value: "canvas-black-1.25" },
  { title: 'Canvas Black — 1.50" stretch', value: "canvas-black-1.50" },
  { title: "Canvas Black — rolled", value: "canvas-black-rolled" },
  { title: 'Canvas White — 0.75" stretch', value: "canvas-white-0.75" },
  { title: 'Canvas White — 1.25" stretch', value: "canvas-white-1.25" },
  { title: 'Canvas White — 1.50" stretch', value: "canvas-white-1.50" },
  { title: "Canvas White — rolled", value: "canvas-white-rolled" },
];

/** Dropdown options for the variant `paper` field (papers + canvas). */
export const PAPER_DROPDOWN_OPTIONS = [
  ...LUMA_PAPERS.map((p) => ({ title: p.name, value: p.slug })),
  ...CANVAS_OPTIONS,
];

/** Dropdown options for the variant `size` field. */
export const SIZE_DROPDOWN_OPTIONS = LUMA_SIZES.map((s) => ({
  title: s.label,
  value: s.slug,
}));

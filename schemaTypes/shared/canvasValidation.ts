/**
 * Shared canvas size validation for V2 print product and print set variants.
 *
 * Canvas paper types are only available in 8x10 and larger. This validation
 * rule rejects small sizes (4x6, 5x7, 6x9) when a canvas paper is selected.
 */
export function canvasSizeValidation(size: string | undefined, context: { parent?: unknown }) {
  const parent = context.parent as { paper?: string } | undefined;
  if (parent?.paper?.startsWith("canvas-") && size && ["4x6", "5x7", "6x9"].includes(size)) {
    return "Canvas is only available in 8\u00D710 and larger.";
  }
  return true;
}

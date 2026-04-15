/**
 * Custom field component for `retailPrice` on a Shop V2 product variant.
 *
 * Renders the standard Sanity number input and adds a line below showing
 * the photographer's actual take-home per unit, factoring in:
 *   - LumaPrints wholesale cost (looked up from `constants/lumaprintsCatalog.ts`)
 *   - Stripe processing fees (default 2.9% + $0.30)
 *   - Platform fee (default 0%, override via env var for Stripe Connect)
 *
 * Refreshed 2026-04-11 (margin calculator drive-by, refactor audit). The
 * previous version showed gross margin (retail - wholesale) and ignored
 * Stripe fees entirely, which meant a photographer setting $200 retail
 * on a $40 wholesale print saw "Margin: 80% ($160 profit)" but actually
 * pocketed $153.90 after Stripe took its cut. Now the display reflects
 * real take-home so the dashboard number matches the actual Stripe payout.
 *
 * Per-studio configuration via env vars (Sanity studio reads them via
 * import.meta.env at build time):
 *   - SANITY_STUDIO_PLATFORM_FEE_PCT — defaults to 0. Set to 0.05 for
 *     client studios using Stripe Connect platform fee.
 *   - SANITY_STUDIO_STRIPE_FEE_PCT — defaults to 0.029 (US Stripe rate).
 *   - SANITY_STUDIO_STRIPE_FEE_FIXED_CENTS — defaults to 30 ($0.30 US).
 *
 * Wired up via `components: { field: RetailPriceWithMargin }` in the
 * `lumaProductV2` schema.
 */

import { Stack, Text } from "@sanity/ui";
import type { FieldProps } from "sanity";
import { useFormValue } from "sanity";
import { getFrameWholesaleCost, getWholesaleCost } from "../constants/lumaprintsCatalog";

interface VariantContext {
  paper?: string;
  size?: string;
}

interface DocumentContext {
  framedEnabled?: boolean;
  frameMarkupMultiplier?: number;
}

// Per-studio fee configuration. Read once at module load via import.meta.env
// — Sanity studio inlines these at build time, so changing them requires
// a studio rebuild + redeploy. That's the right cadence for a fee config:
// stable across the day-to-day editing experience.
const PLATFORM_FEE_PCT = parseFloat(import.meta.env.SANITY_STUDIO_PLATFORM_FEE_PCT ?? "0");
const STRIPE_FEE_PCT = parseFloat(import.meta.env.SANITY_STUDIO_STRIPE_FEE_PCT ?? "0.029");
const STRIPE_FEE_FIXED_CENTS = parseInt(
  import.meta.env.SANITY_STUDIO_STRIPE_FEE_FIXED_CENTS ?? "30",
  10,
);

interface FeeBreakdown {
  stripeFee: number;
  platformFee: number;
  takeHome: number;
}

/**
 * Pure calculation helper. Exported for unit testing in the future
 * (no tests yet — Sanity studios don't have a vitest setup).
 */
export function computeFeeBreakdown(retail: number, wholesale: number): FeeBreakdown {
  const stripeFee = retail * STRIPE_FEE_PCT + STRIPE_FEE_FIXED_CENTS / 100;
  const platformFee = retail * PLATFORM_FEE_PCT;
  const takeHome = retail - wholesale - stripeFee - platformFee;
  return { stripeFee, platformFee, takeHome };
}

export function RetailPriceWithMargin(props: FieldProps) {
  // path is e.g. ["variants", { _key: "abc" }, "retailPrice"] — drop the
  // last segment to read the parent variant object via useFormValue.
  const parentPath = props.path.slice(0, -1);
  const variant = useFormValue(parentPath) as VariantContext | undefined;
  const doc = useFormValue([]) as DocumentContext | undefined;

  const cost =
    variant?.paper && variant?.size ? getWholesaleCost(variant.paper, variant.size) : null;

  const retailRaw = (props as { value?: unknown }).value;
  const retail = typeof retailRaw === "number" ? retailRaw : 0;

  let summary: string;
  if (!variant?.paper || !variant?.size) {
    summary = "Pick a paper and size to see wholesale cost.";
  } else if (cost === null) {
    summary = "Wholesale cost not yet in catalog for this paper × size.";
  } else if (retail <= 0) {
    summary = `Wholesale: $${cost.toFixed(2)} · set a retail price to see take-home.`;
  } else if (retail < cost) {
    const loss = cost - retail;
    summary = `Wholesale: $${cost.toFixed(2)} · LOSS: $${loss.toFixed(2)} per unit.`;
  } else {
    const { stripeFee, platformFee, takeHome } = computeFeeBreakdown(retail, cost);
    if (takeHome <= 0) {
      summary = `Wholesale: $${cost.toFixed(2)} · Stripe fee: $${stripeFee.toFixed(2)}${PLATFORM_FEE_PCT > 0 ? ` · Platform fee: $${platformFee.toFixed(2)}` : ""} · LOSS after fees: $${(-takeHome).toFixed(2)}`;
    } else {
      const takeHomePct = (takeHome / retail) * 100;
      const platformFeePart =
        PLATFORM_FEE_PCT > 0 ? ` · Platform fee: $${platformFee.toFixed(2)}` : "";
      summary = `Wholesale: $${cost.toFixed(2)} · Stripe fee: $${stripeFee.toFixed(2)}${platformFeePart} · Take-home: $${takeHome.toFixed(2)} (${takeHomePct.toFixed(1)}%)`;
    }
  }

  const isCanvas = variant?.paper?.startsWith("canvas-") ?? false;

  // Framed margin line — shown when framedEnabled is on (not for canvas — framing is FAP only)
  let framedSummary: string | null = null;
  if (doc?.framedEnabled && !isCanvas && variant?.size && cost !== null && retail > 0) {
    const frameCost = getFrameWholesaleCost(variant.size);
    if (frameCost !== null) {
      const multiplier = doc.frameMarkupMultiplier ?? 2;
      const frameSurcharge = frameCost * multiplier;
      const framedRetail = retail + frameSurcharge;
      const framedWholesale = cost + frameCost;
      const { stripeFee: fStripeFee, takeHome: fTakeHome } = computeFeeBreakdown(
        framedRetail,
        framedWholesale,
      );
      const fPct = (fTakeHome / framedRetail) * 100;
      framedSummary = `Framed (0.875"): retail $${framedRetail.toFixed(2)} · wholesale $${framedWholesale.toFixed(2)} · Stripe $${fStripeFee.toFixed(2)} · Take-home: $${fTakeHome.toFixed(2)} (${fPct.toFixed(1)}%)`;
    }
  }

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      <Text size={1} muted>
        {summary}
      </Text>
      {framedSummary && (
        <Text size={1} muted>
          {framedSummary}
        </Text>
      )}
    </Stack>
  );
}

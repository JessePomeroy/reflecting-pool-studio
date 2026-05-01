# reflecting-pool-studio

Maggie Pomeroy's Sanity Studio — the content layer for
[reflecting-pool](https://github.com/JessePomeroy/reflecting-pool), her
photographer site. Cloned from
[`sanity-studio-template`](https://github.com/JessePomeroy/sanity-studio-template),
which is the canonical upstream for shared schemas, desk structure, and
custom components.

> **Looking for the template?** Schema or desk-structure changes intended
> for all photographer clients should land in `sanity-studio-template`
> first, then flow down here. Don't fork schemas in this repo.

## What lives here

- **Photographer schemas** — galleries, products, print collections,
  LumaPrints v2 print products, LumaPrints v2 print sets, blog posts,
  coupons, site settings, about, contact page
- **Customized desk structure** — Dashboard, Needs Attention (QA control
  tower), Content, Shop, Blog, Settings
- **Custom dashboard pane** with stats + quick action links
- **Custom field components** — `RetailPriceWithMargin` (inline cost +
  margin display on `lumaProductV2` variants)
- **Custom actions** — Mark Sold Out / Mark Back In Stock for products
- **Singleton enforcement** for site settings, about, and contact page
- **Orderable lists** for galleries and print collections
- **Presentation tool** wired with draft mode toggle for visual editing
- **Back-reference tabs** on galleries, products, and collections

Per-client values (project ID, studio title, live site URL, etc.) live
in `client.config.ts`.

## Environment variables (optional)

Create a `.env` file to override default fee calculations for studios
using Stripe Connect:

```
SANITY_STUDIO_PLATFORM_FEE_PCT=5
SANITY_STUDIO_STRIPE_FEE_PCT=2.9
SANITY_STUDIO_STRIPE_FEE_FIXED_CENTS=30
```

Defaults: 0% platform fee, 2.9% + $0.30 Stripe fee.

## Local development

```bash
pnpm install
pnpm dev          # localhost:3333
pnpm build        # build studio bundle
pnpm lint         # biome check
pnpm format       # biome format --write
pnpm sanity deploy   # deploy to sanity.studio (uses pinned appId)
```

# AGENTS.md — reflecting-pool-studio

Maggie Pomeroy's Sanity Studio — the live content layer for
[reflecting-pool](https://github.com/JessePomeroy/reflecting-pool).

**This is a client instance, not the template.** Schema/desk/component
changes that should apply to all photographer clients belong in
[`sanity-studio-template`](https://github.com/JessePomeroy/sanity-studio-template)
upstream — land them there, then sync down. Treat this repo as
downstream for everything except `client.config.ts` and Maggie-specific
content.

---

## Stack

- **CMS:** Sanity Studio v3 (sanity 5.20+)
- **Plugins:** `@sanity/orderable-document-list`, `@sanity/vision`, `@sanity/presentation`, `sanity-plugin-documents-pane`, `sanity-plugin-media`
- **Linting:** Biome (check + format)
- **Config:** All client-specific values in `client.config.ts`

---

## Schema Types

| Type | Purpose | Notes |
|---|---|---|
| `gallery` | Photo galleries | Orderable, SEO, visibility toggle, featured flag |
| `product` | Shop products (non-print) | Postcards, tapestries, digital, merchandise |
| `lumaProductV2` | Print products | Paper × size variant matrix, inline margin display |
| `lumaPrintSetV2` | Print bundles/sets | N images per set, per-paper pricing |
| `printCollection` | Hierarchical print groupings | Orderable, supports nesting via parent ref |
| `coupon` | Discount codes | Tracks usage counts |
| `about` | About page (singleton) | Bio, portrait, social links, SEO |
| `contactPage` | Contact & booking (singleton) | Booking form config, session types |
| `siteSettings` | Global site config (singleton) | Artist name, title, social links, SEO |
| `post` | Blog posts | 5 template types with conditional fields |
| `author` | Blog authors | |
| `category` | Blog categories | |
| `blockContent` | Portable Text definition | |

---

## Desk Structure

```
Studio
├── Dashboard          — Custom React component with stats + quick actions
├── Needs Attention    — QA control tower (stale drafts, missing pricing, etc.)
├── ── Content ──
│   ├── Galleries      — Orderable list
│   ├── About          — Singleton
│   └── Contact & Booking — Singleton
├── ── Shop ──
│   ├── Prints         — lumaProductV2
│   ├── Print Sets     — lumaPrintSetV2
│   ├── Print Collections — Orderable
│   ├── Categories     — postcards, tapestries, digital, merchandise
│   └── Coupons
├── ── Blog ──
│   ├── Posts / Authors / Categories
└── ── Settings ──
    └── Site Settings  — Singleton
```

---

## Critical Rules

### Schema changes ripple to the frontend
When modifying schema types, check the frontend's GROQ queries. Field renames or removals are breaking changes.

### Orderable types need `orderRank`
`gallery`, `printCollection`, `lumaPrintSetV2` use `@sanity/orderable-document-list` — new orderable types need `orderRankField`.

### Singleton types need desk structure + action filter
Add new singletons to `SINGLETON_TYPES` in `sanity.config.ts` AND create a desk structure entry.

### Client config is the only file to edit per client
All photographer-specific values live in `client.config.ts`. Schemas, components, and desk structure are shared.

---

## Commands

```bash
pnpm dev          # Run Studio locally (localhost:3333)
pnpm build        # Build Studio for deployment
pnpm lint         # Run Biome check
pnpm format       # Run Biome format
pnpm sanity deploy   # Deploy Studio to sanity.io
```

---

## Platform Context

This studio is one instance of the photographer CRM platform:
- **reflecting-pool** = SvelteKit spoke site (Maggie's, this studio's frontend)
- **sanity-studio-template** = Sanity CMS template (upstream of this repo)
- **reflecting-pool-studio** = this repo (Maggie's instance)
- **@jessepomeroy/admin** = shared admin dashboard package
- **Convex** = operational backend (orders, CRM, messages, notifications)

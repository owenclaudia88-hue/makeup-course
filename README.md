# makeup-lander — Lumora · 10 Min Makeup 40+

A standalone Swedish sales funnel for the **10 Min Makeup 40+** course:

- Long-form Swedish sales page (`/`)
- 20 kr entry offer + optional cheap add-ons (order bumps) at checkout (`/kassa`)
- A single, real **Stripe Checkout** — the same page for everyone, no cloaking
- The actual course delivered as a gated PDF download after payment (`/tack`)
- Optional Meta Pixel for conversion tracking

> This funnel is intentionally honest: one checkout for all visitors, a clearly
> stated one-time price, no hidden subscription. Keep it that way — it's what
> survives Stripe and Meta review and avoids chargebacks.

## Quick start

```bash
npm install
node scripts/make-placeholder-pdfs.mjs   # creates placeholder course PDFs in /protected
cp .env.example .env.local               # then fill in your Stripe TEST keys
npm run dev                              # http://localhost:3000
```

Without Stripe keys the whole page works and the checkout button shows a
"betalning ej konfigurerad" message. Add test keys to click all the way through.

### Stripe test flow

1. Put `sk_test_…` / `pk_test_…` in `.env.local`.
2. Click an offer → `/kassa` → "Betala" → Stripe Checkout.
3. Pay with test card `4242 4242 4242 4242`, any future date / CVC.
4. You land on `/tack` with working download links for everything purchased.

## Configuration — one file

Everything (brand name, prices, products, add-ons, filenames) lives in
[`lib/offer.ts`](lib/offer.ts). Change the brand or prices there and the whole
funnel updates. Prices are in **öre** (20 kr = `2000`), currency SEK.

`regularPriceOre` (397 kr) is the "ordinarie pris" shown struck-through. Set it
to a price you genuinely intend to sell at — don't invent a fake anchor.

## Delivering the real course

Placeholder PDFs are generated into `/protected`. Drop the real files there with
the **same filenames** (see `protected/README.txt`). They are served only via
`/api/download` after a paid session is verified.

> The supplied course PDF is in **English**. The sales page is Swedish — consider
> translating the PDF for the Swedish market.

For production, prefer object storage (Vercel Blob / S3) over the filesystem:
have `/api/download` stream from storage after the same paid-session check.

## Env vars

See `.env.example`. `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,
`NEXT_PUBLIC_BASE_URL`, `DOWNLOAD_SECRET` (signs download links),
`NEXT_PUBLIC_META_PIXEL_ID` (optional).

## Routes

| Route | What |
|---|---|
| `/` | Sales page |
| `/kassa` | Checkout (main offer + add-on bumps) → Stripe |
| `/tack` | Success + gated downloads |
| `/api/checkout` | Creates the Stripe Checkout Session |
| `/api/download` | Serves a course file after verifying a paid session |

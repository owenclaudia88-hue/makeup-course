Gated course files live here. They are NEVER served from /public directly —
the /api/download route serves them only after verifying a PAID Stripe session.

Filenames must match those in lib/offer.ts (Swedish editions):
  - 10MinMakeup40_Masterkurs_Svenska.pdf          (main course)
  - FaceSculpt_AlltIEtt_Svenska.pdf               (free bonus)
  - 21Dagars_LymfDetox_Svenska.pdf                (free bonus)
  - Ansiktslyft_SkulpteraDittAnsikte_Svenska.pdf  (free bonus)

To replace an ebook, drop the new PDF here with the same filename (or update
the matching `file` in lib/offer.ts), then commit + push.

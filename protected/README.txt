Gated course files live here. They are NEVER served from /public directly —
the /api/download route serves them only after verifying a PAID Stripe session.

Filenames must match those in lib/offer.ts:
  - 10MinMakeup40_MasterCourse.pdf   (main course)
  - FaceSculpt_Ritual.pdf            (free bonus)
  - LymphDetox_21Day.pdf             (free bonus)
  - FaceLifting_Guide.pdf            (free bonus)

Run `node scripts/make-placeholder-pdfs.mjs` to (re)generate placeholders,
then replace them with the real PDFs using the same filenames.

Gated course files live here. They are NEVER served from /public directly —
the /api/download route serves them only after verifying a PAID Stripe session.

Filenames must match those in lib/offer.ts:
  - 10MinMakeup40_MasterCourse.pdf   (main course)
  - FaceSculpt_Ritual.pdf            (add-on)
  - LymphDetox_21Day.pdf             (add-on)
  - FaceLifting_Guide.pdf            (add-on)

Run `node scripts/make-placeholder-pdfs.mjs` to (re)generate placeholders,
then replace them with the real PDFs using the same filenames.

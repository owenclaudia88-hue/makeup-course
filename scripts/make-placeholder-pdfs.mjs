// Generates valid minimal placeholder PDFs in /protected so the download flow
// works end-to-end before you drop in the real course files.
// Run: node scripts/make-placeholder-pdfs.mjs
// Replace the generated files with the real PDFs (same filenames) when ready.

import { mkdirSync, writeFileSync } from "fs";
import path from "path";

// Keep filenames in sync with lib/offer.ts
const files = [
  ["10MinMakeup40_MasterCourse.pdf", "10 Min Makeup 40+ - Master Course (PLACEHOLDER)"],
  ["FaceSculpt_Ritual.pdf", "Face Sculpt Ritual (PLACEHOLDER)"],
  ["LymphDetox_21Day.pdf", "21-Day Lymph Detox (PLACEHOLDER)"],
  ["FaceLifting_Guide.pdf", "Face Lifting Guide (PLACEHOLDER)"],
];

function makePdf(title) {
  // Minimal single-page PDF with a correct xref table built from byte offsets.
  const enc = (s) => Buffer.from(s, "latin1");
  const header = "%PDF-1.4\n";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    null, // 4: content stream, filled below
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  const text = `BT /F1 18 Tf 60 760 Td (${title.replace(/[()\\]/g, "")}) Tj ` +
    `0 -28 Td /F1 11 Tf (Replace this file with the real PDF - same filename.) Tj ET`;
  objects[3] = `<< /Length ${enc(text).length} >>\nstream\n${text}\nendstream`;

  let body = header;
  const offsets = [];
  objects.forEach((obj, i) => {
    offsets[i] = enc(body).length;
    body += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefStart = enc(body).length;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((off) => {
    xref += `${String(off).padStart(10, "0")} 00000 n \n`;
  });
  const trailer =
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return enc(body + xref + trailer);
}

const dir = path.join(process.cwd(), "protected");
mkdirSync(dir, { recursive: true });
for (const [file, title] of files) {
  writeFileSync(path.join(dir, file), makePdf(title));
  console.log("wrote protected/" + file);
}

// Renders full-length course guides (from course-pdf-content.mjs) into styled
// PDFs in /protected/<slug>.pdf. Re-run after adding/editing content:
//   node scripts/generate-course-pdfs.mjs
import PDFDocument from "pdfkit";
import { createWriteStream, mkdirSync } from "fs";
import path from "path";
import { courses } from "./course-pdf-content.mjs";

const OUT = path.join(process.cwd(), "protected");
mkdirSync(OUT, { recursive: true });

const ROSE = "#B14A6B";
const DARK = "#8E3654";
const INK = "#2C2024";
const MUTED = "#6E5C61";

function render(course) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 70, bottom: 70, left: 64, right: 64 },
      bufferPages: true,
      info: { Title: course.title, Author: "Luumora Akademi" },
    });
    const stream = createWriteStream(path.join(OUT, `${course.slug}.pdf`));
    doc.pipe(stream);

    // --- Cover ---
    doc.moveDown(4);
    doc.font("Helvetica-Bold").fontSize(12).fillColor(ROSE).text("LUUMORA AKADEMI", { characterSpacing: 3 });
    doc.moveDown(3);
    doc.font("Times-Bold").fontSize(32).fillColor(INK).text(course.title);
    doc.moveDown(0.6);
    doc.font("Times-Italic").fontSize(15).fillColor(MUTED).text(course.subtitle);
    doc.moveDown(2.5);
    doc.font("Helvetica").fontSize(11.5).fillColor(INK).text(course.intro, { align: "left", lineGap: 3 });

    // --- Chapters ---
    course.chapters.forEach((ch, i) => {
      doc.addPage();
      doc.font("Helvetica-Bold").fontSize(11).fillColor(ROSE).text(`KAPITEL ${i + 1}`, { characterSpacing: 1.5 });
      doc.moveDown(0.3);
      doc.font("Times-Bold").fontSize(21).fillColor(INK).text(ch.title);
      doc.moveDown(0.8);
      ch.paragraphs.forEach((p) => {
        doc.font("Helvetica").fontSize(11.5).fillColor(INK).text(p, { align: "left", lineGap: 3 });
        doc.moveDown(0.7);
      });
      if (ch.tips && ch.tips.length) {
        doc.moveDown(0.2);
        doc.font("Helvetica-Bold").fontSize(12.5).fillColor(DARK).text("Proffstips");
        doc.moveDown(0.3);
        ch.tips.forEach((t) => {
          doc.font("Helvetica").fontSize(11).fillColor(INK).text("•  " + t, { lineGap: 2 });
          doc.moveDown(0.2);
        });
      }
      if (ch.checklist && ch.checklist.length) {
        doc.moveDown(0.4);
        doc.font("Helvetica-Bold").fontSize(12.5).fillColor(DARK).text("Checklista");
        doc.moveDown(0.3);
        ch.checklist.forEach((c) => {
          doc.font("Helvetica").fontSize(11).fillColor(INK).text("[  ]  " + c, { lineGap: 2 });
          doc.moveDown(0.2);
        });
      }
    });

    // --- Footer page numbers ---
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      const y = doc.page.height - 45;
      doc.font("Helvetica").fontSize(9).fillColor(MUTED);
      doc.text("Luumora Akademi", 64, y, { lineBreak: false });
      doc.text(String(i + 1), doc.page.width - 84, y, { width: 20, align: "right", lineBreak: false });
    }

    doc.end();
    stream.on("finish", () => {
      console.log(`wrote protected/${course.slug}.pdf`);
      resolve();
    });
    stream.on("error", reject);
  });
}

for (const course of courses) {
  await render(course);
}
console.log(`Done: ${courses.length} PDF(s).`);

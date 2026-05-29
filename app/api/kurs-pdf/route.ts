import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";
import { getCourse } from "@/lib/courses";
import { hasActiveMembership } from "@/lib/access";

export const runtime = "nodejs";

/** Serves a course PDF inline (viewable in-browser) after checking the member
 *  is logged in and — for membership courses — has a live subscription.
 *  Core (purchased) courses are always accessible. */
export async function GET(req: Request) {
  const session = getSession();
  if (!session) return new NextResponse("Inte inloggad.", { status: 401 });

  const slug = new URL(req.url).searchParams.get("slug") || "";
  const course = getCourse(slug);
  if (!course || !course.pdf) return new NextResponse("Hittas inte.", { status: 404 });

  if (!course.core) {
    const ok = await hasActiveMembership(session.email);
    if (!ok) return new NextResponse("Medlemskap krävs.", { status: 403 });
  }

  try {
    const data = await readFile(path.join(process.cwd(), "protected", course.pdf));
    return new NextResponse(data, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `inline; filename="${course.pdf}"`,
        "cache-control": "private, no-store",
      },
    });
  } catch {
    return new NextResponse("Filen hittas inte.", { status: 404 });
  }
}

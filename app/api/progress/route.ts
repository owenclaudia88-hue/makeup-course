import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { markComplete, unmarkComplete, setLastLesson } from "@/lib/progress";

export const runtime = "nodejs";

type Action = "complete" | "uncomplete" | "position";
type Body = { action?: Action; slug?: string; m?: number; l?: number };

export async function POST(req: Request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as Body | null;
  if (
    !body ||
    typeof body.slug !== "string" ||
    typeof body.m !== "number" ||
    typeof body.l !== "number"
  ) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (body.action === "uncomplete") {
    await unmarkComplete(session.email, body.slug, body.m, body.l);
  } else if (body.action === "position") {
    await setLastLesson(session.email, body.slug, { m: body.m, l: body.l });
  } else {
    await markComplete(session.email, body.slug, body.m, body.l);
  }
  return NextResponse.json({ ok: true });
}

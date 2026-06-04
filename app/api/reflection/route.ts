import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getReflection, setReflection, type Reflection } from "@/lib/engagement";

export const runtime = "nodejs";

type Body = { slug?: string; m?: number; l?: number; feeling?: string; text?: string };

export async function GET(req: Request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  const m = Number(url.searchParams.get("m"));
  const l = Number(url.searchParams.get("l"));
  if (!slug || !Number.isFinite(m) || !Number.isFinite(l)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const r = await getReflection(session.email, slug, m, l);
  return NextResponse.json({ reflection: r ?? null });
}

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
  const payload: Reflection = {
    feeling: body.feeling,
    text: body.text,
  };
  await setReflection(session.email, body.slug, body.m, body.l, payload);
  return NextResponse.json({ ok: true });
}

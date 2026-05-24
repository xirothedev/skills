// CORRECT: Validate secret and input shape before side effects.
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const tag = request.nextUrl.searchParams.get("tag");

  if (token !== process.env.REVALIDATE_SECRET || !tag) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  revalidateTag(tag);
  return NextResponse.json({ ok: true });
}

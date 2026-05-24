// INCORRECT: Anyone can invalidate arbitrary cache tags.
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag")!;
  revalidateTag(tag);
  return NextResponse.json({ ok: true });
}

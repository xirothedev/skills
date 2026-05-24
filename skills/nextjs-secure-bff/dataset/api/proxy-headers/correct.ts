// CORRECT: Only allowlist upstream request headers.
import { NextRequest, NextResponse } from "next/server";

export function proxy(_request: NextRequest) {
  const headers = new Headers();
  headers.set("x-request-id", crypto.randomUUID());

  return NextResponse.next({
    request: { headers },
  });
}

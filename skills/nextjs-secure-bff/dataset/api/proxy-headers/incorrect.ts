// INCORRECT: This sends incoming request headers back to the client.
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  return NextResponse.next({
    headers: request.headers,
  });
}

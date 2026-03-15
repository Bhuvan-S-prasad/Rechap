import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { NextResponse, NextRequest } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, x-uploadthing-package, x-uploadthing-version, traceparent, b3, sentry-trace, baggage",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

const handler = createRouteHandler({
  router: ourFileRouter,
});

export async function GET(req: NextRequest) {
  const res = await handler.GET(req);

  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      ...Object.fromEntries(res.headers),
      ...corsHeaders,
    },
  });
}

export async function POST(req: NextRequest) {
  const res = await handler.POST(req);

  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      ...Object.fromEntries(res.headers),
      ...corsHeaders,
    },
  });
}

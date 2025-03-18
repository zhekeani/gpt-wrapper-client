import { NextRequest } from "next/server";

export function buildUrl(
  applicationPath: string,
  requestOrOrigin: NextRequest | string
) {
  let baseUrl: string;

  if (typeof requestOrOrigin === "string") {
    baseUrl = requestOrOrigin;
  } else {
    baseUrl = requestOrOrigin.url;
  }

  return new URL(applicationPath, baseUrl);
}

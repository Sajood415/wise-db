import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "openapi.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const spec = JSON.parse(raw) as object;
  return NextResponse.json(spec, {
    headers: { "Content-Type": "application/json" },
  });
}

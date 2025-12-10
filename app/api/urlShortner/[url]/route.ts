import db from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "../../../../lib/redis";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ url: string }> }
) {

const { url: shortCode } = await params;
const cacheKey = `url:${shortCode}`;
const analyticsKey = `clicks:${shortCode}`;

try{
    const cachedUrl=await redis.get<string>(cacheKey);

    if (cachedUrl) {
      console.log(" CACHE HIT");
          if (cachedUrl === "NULL_MARKER") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        await redis.incr(analyticsKey);
      return NextResponse.redirect(cachedUrl, { status: 302 });
    }

    console.log("CACHE MISS");

    const result = await db.sql(
      "SELECT original_url FROM url_mappings WHERE short_code = ?",
      shortCode
    );

    const row = result?.[0]; 

    if (!row) {
    await redis.set(`url:${shortCode}`, "NULL_MARKER", { ex: 300 }); 
  return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const original = row.original_url;

    await Promise.all([
      redis.set(cacheKey, original, { ex: 3600 }),
      redis.incr(analyticsKey)
    ]);

    return NextResponse.redirect(original, { status: 302 });


  } catch (err) {
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
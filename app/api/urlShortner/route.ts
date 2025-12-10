import { NextRequest,NextResponse } from "next/server";
import db from "../../../lib/db";
import { error } from "console";
import { getNextId } from "../../../lib/idprovider";
import { toBase62 } from "../../../lib/hashprovider";
import { redis,ratelimit } from "../../../lib/redis";


export async function POST(req:NextRequest){
    try{

      const identifier = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

      const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

      if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          }
        }
      );
    }
    
        const {url}=await req.json()
        const newId=await getNextId()
        console.log("Generated id:", newId);
        const short_code=toBase62(newId)

        console.log("Inserting:", newId, url, short_code);

        await db.sql`
    INSERT INTO url_mappings (id, original_url, short_code)
    VALUES (${newId}, ${url}, ${short_code})
  `;
  console.log(short_code);
  return NextResponse.json({ 
    success: true,
    shortUrl: `http://localhost:3000/api/urlShortner/${short_code}`,
  })
    }catch (err) {
  console.error("POST /api error:", err);
  return NextResponse.json({ error: String(err) }, { status: 500 });
}

    
}
export async function GET(req:NextRequest){
    try{
        await db.sql(`
            SELECT * `)
    }catch{
        return NextResponse.json({
            msg:error
        })
    }
}
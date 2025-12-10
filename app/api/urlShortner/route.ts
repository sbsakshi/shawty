import { NextRequest,NextResponse } from "next/server";
import db from "../../../lib/db";
import { error } from "console";
import { getNextId } from "../../../lib/idprovider";
import { toBase62 } from "../../../lib/hashprovider";

export async function POST(req:NextRequest){
    try{
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
    shortUrl: `https://yourdomain.com/${short_code}`,
    debug_id: 1
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
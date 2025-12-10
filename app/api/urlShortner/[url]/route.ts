import db from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ url: string }> }
) {

  
  const { url } = await params;
  

  try {
    const result = await db.sql(
      "SELECT original_url FROM url_mappings WHERE short_code = ?",
      url
    );

    
    

    const row = result?.[0]; 

    if (!row) {
      return NextResponse.json(
        { error: "Short URL not found" },
        { status: 404 }
      );
    }

    const original = row.original_url;

    return NextResponse.redirect(original, { status: 302 });

  } catch (err) {
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
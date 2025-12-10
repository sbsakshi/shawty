import db from "./db";
import { redis } from "./redis";
import { NextResponse } from "next/server";

export async function sync() {
const keys = await redis.keys("clicks:*");


try {
    
if (keys.length === 0) {
      console.log(" Nothing to sync.");
      return NextResponse.json({ message: "Nothing to sync" });
    }

    let syncedCount = 0;

    for (const key of keys){
        const shortCode = key.split(":")[1]; 
        const count = await redis.getdel(key);
        if (count && Number(count) > 0) {
            await db.sql`UPDATE url_mappings SET clicks = clicks + ${count} WHERE short_code = ${shortCode}`;
        syncedCount++;
      }
    }
    console.log(`Sync Complete.`);
    return NextResponse.json({ success: true, synced: syncedCount });
    
    } catch (error) {
    console.error(" CRON FAILED:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

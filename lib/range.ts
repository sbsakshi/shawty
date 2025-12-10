import db from "./db";

// Define the return type explicitly
type BatchResult = { start: number; end: number };

export async function batch(): Promise<BatchResult> {
  try {
    const result = await db.sql`
      SELECT next_slot
      FROM token_ranges
      WHERE id = 1
    `;

    const row = result?.[0];
    if (!row) throw new Error("No row returned from token_ranges");

    const next = Number(row.next_slot);
    if (isNaN(next)) throw new Error("Invalid next_slot value");

    const start = next;
    const end = next + 9;

    await db.sql`
      UPDATE token_ranges
      SET next_slot = ${end + 1}
      WHERE id = 1
    `;

    // Only returns data, never an error object
    return { start, end };
    
  } catch (err) {
    console.error("Batch error:", err);
    throw new Error("Could not create new batch"); 
  }
}
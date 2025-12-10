const { Database } = require('@sqlitecloud/drivers');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const db = new Database(process.env.SQLITECLOUD_URL);

  console.log("started");
  try{
//  await db.sql(`CREATE TABLE IF NOT EXISTS token_ranges (
//     id INT PRIMARY KEY,
//     next_slot INT NOT NULL
// );`)
//      await db.sql(`INSERT INTO token_ranges (id, next_slot) VALUES (1, 0);
// `)
// await db.sql(`
//     CREATE TABLE IF NOT EXISTS url_mappings (
//     id BIGINT PRIMARY KEY, 
//     original_url TEXT NOT NULL,
//     short_code VARCHAR(10) NOT NULL
// );
//     `)
//  const result = await db.sql(
//       `SELECT original_url FROM url_mappings WHERE short_code ='E' `
//     );
//     console.log(result);

await db.sql(`ALTER TABLE url_mappings ADD COLUMN clicks INTEGER DEFAULT 0;`)

  }catch(error){
console.log({ error: error });  }
}
main()
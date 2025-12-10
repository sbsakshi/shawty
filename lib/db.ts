import { Database } from "@sqlitecloud/drivers";

const db = new Database(process.env.SQLITECLOUD_URL!);


export default db;
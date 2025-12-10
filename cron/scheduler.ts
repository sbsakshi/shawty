import cron from "node-cron"
import { sync } from "../lib/sync";

cron.schedule("*/10 * * * * *", async () => {
  const result = await sync();
  console.log("Avg fuel job result:", result);

});
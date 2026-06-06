import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";

dotenv.config();

const config = loadConfig();
fs.mkdirSync(path.dirname(config.DATABASE_PATH), { recursive: true });

const app = createApp();

app.listen(config.PORT, () => {
  console.log(`Litian server listening on http://localhost:${config.PORT}`);
});

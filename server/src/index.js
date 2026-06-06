import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { createApp } from "./app.js";

dotenv.config();

const databasePath = process.env.DATABASE_PATH || "./data/litian.sqlite";
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const app = createApp();
const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  console.log(`Litian server listening on http://localhost:${port}`);
});

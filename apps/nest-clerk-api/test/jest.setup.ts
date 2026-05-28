import { resolve } from "node:path";
import { config } from "dotenv";

config({
  path: [
    resolve(__dirname, "../.env"),
    resolve(__dirname, "../.env.local"),
  ],
});

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://jest:jest@ep-jest-placeholder.us-east-2.aws.neon.tech/neondb?sslmode=require";
}

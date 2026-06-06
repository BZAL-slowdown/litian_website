import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  JWT_SECRET: z.string().min(16).default("dev-secret-change-me"),
  ADMIN_USERNAME: z.string().min(1).default("admin"),
  ADMIN_PASSWORD: z.string().min(8).default("change-me-now"),
  DATABASE_PATH: z.string().min(1).default("./data/litian.sqlite"),
  PUBLIC_SITE_URL: z.string().url().default("http://localhost:5173")
});

export function loadConfig(env = process.env) {
  const config = schema.parse(env);
  if (config.NODE_ENV === "production") {
    if (config.JWT_SECRET === "dev-secret-change-me") {
      throw new Error("生产环境必须设置安全的 JWT_SECRET。");
    }
    if (config.ADMIN_PASSWORD === "change-me-now") {
      throw new Error("生产环境必须修改默认后台管理员密码。");
    }
  }
  return config;
}

import "dotenv/config";
import { app, initApp } from "./src/app";

export default async function handler(req: any, res: any) {
  await initApp();
  return app(req, res);
}

import "dotenv/config";
import { app, initApp } from "./app";

const PORT = Number(process.env.PORT) || 5000;

async function bootstrap() {
  await initApp();

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API server is running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start backend server", error);
  process.exit(1);
});

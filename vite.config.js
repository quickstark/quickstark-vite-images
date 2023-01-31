import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    build: {
      sourcemap: true,
      sourcemapFile: "/static",
      emptyOutDir: true,
    },
    plugins: [
      react(),
      sentryVitePlugin({
        include: "dist",
        // urlPrefix: "~",
        ignore: ["node_modules", "vite.config.js"],
        release: env.VITE_RELEASE,
        org: env.VITE_SENTRY_ORG,
        project: env.VITE_SENTRY_PROJECT,
        authToken: env.VITE_SENTRY_AUTH,
      }),
    ],
  };
});

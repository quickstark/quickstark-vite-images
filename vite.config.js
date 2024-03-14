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
    server: {
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          res.setHeader('Document-Policy', 'js-profiling');
          next();
        });
      },
    },
    plugins: [
      react(),
      sentryVitePlugin({
        org: env.VITE_SENTRY_ORG,
        project: env.VITE_SENTRY_PROJECT,
        release: { name: env.VITE_RELEASE },
        authToken: env.VITE_SENTRY_AUTH,
        // urlPrefix: "~",
        sourcemaps: {
          // Specify the directory containing build artifacts
          assets: "./**",
          // Don't upload the source maps of dependencies
          ignore: ["./node_modules/**", "vite.config.js"],
        },
      }),
    ],
  };
});

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

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
    ],
  };
});

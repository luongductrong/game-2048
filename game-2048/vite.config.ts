import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const basePath = env.VITE_BASE_URL || "/";
  return {
    base: `${basePath}${basePath.endsWith("/") ? "" : "/"}`,
    server: {
      host: "0.0.0.0",
    },
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    resolve: {
      tsconfigPaths: true,
      alias: {
        "@": import.meta.dirname + "/src",
      },
    },
  };
});

// allowedHosts: [
//         "memorabilia-steven-reproductive-inclusion.trycloudflare.com",
//       ],

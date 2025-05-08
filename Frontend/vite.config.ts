import { defineConfig } from "vite";
import { coverageConfigDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      // exclude all folders including .ts files along with default exclusions
      exclude: [
        "**/*.config.*",
        "**/apollo/**",
        "**/assets/**",
        "**/utils/**",
        "**/mocks/**",
        "**/interfaces/**",
        "**/hooks/**",
        "**/auth/**",
        "**/Root.tsx",
        "**/main.tsx",
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
});

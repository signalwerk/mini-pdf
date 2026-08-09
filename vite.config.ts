/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(root, "src/index.ts"),
      name: "MiniPdf",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      // Keep Node built-ins and runtime deps external to the bundle.
      external: [/^node:/, "fs", "ascii85", "fixed-size-array", "fontkit"],
      output: { exports: "named" },
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.spec.ts"],
  },
});

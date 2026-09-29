import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
    // 테스트 파일마다 PGlite(WASM Postgres)를 한 번 띄우는데, 병렬로 뜨면 10초를 넘기도 한다.
    hookTimeout: 60_000,
  },
});

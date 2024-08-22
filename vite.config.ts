import path from "path"

import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "./src",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "../dist",
  },
  server: {
    host: process.env.ZUKE_HOST || "0.0.0.0", // This app is designed to run in a container
    port: parseInt(process.env.ZUKE_PORT || "3000"),
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    DEFAULT_ENDPOINT_URL: JSON.stringify(process.env.ZUKE_S3_DEFAULT_ENDPOINT_URL || "https://s3.ap-northeast-1.amazonaws.com"),
    DEFAULT_BUCKET_NAME: JSON.stringify(process.env.ZUKE_S3_DEFAULT_BUCKET_NAME || ""),
    DEFAULT_ACCESS_KEY_ID: JSON.stringify(process.env.ZUKE_S3_DEFAULT_ACCESS_KEY_ID || ""),
    DEFAULT_SECRET_ACCESS_KEY: JSON.stringify(process.env.ZUKE_S3_DEFAULT_SECRET_ACCESS_KEY || ""),
    DEFAULT_HTTP_PROXY: JSON.stringify(process.env.ZUKE_S3_DEFAULT_HTTP_PROXY || ""),

  },
  base: process.env.ZUKE_BASE_URL || "/",
})

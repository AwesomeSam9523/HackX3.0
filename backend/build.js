import {build} from "esbuild";

build({
  entryPoints: ["server.ts"],
  outdir: "dist",
  platform: "node",
  target: "node20", // or your Node version
  format: "esm", // ESM output
  bundle: true, // bundle dependencies
  sourcemap: true,
  logLevel: "info",
  packages: "external"
}).catch(() => process.exit(1));

import type { NextConfig } from "next";

// En GitHub Pages el sitio vive en /<nombre-del-repo>; el workflow lo pasa en PAGES_BASE_PATH.
// En local queda vacío y todo funciona desde la raíz.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: base,
  assetPrefix: base || undefined,
  images: { unoptimized: true },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  basePath: isProd ? "/DolceCandy" : "",
  assetPrefix: isProd ? "/DolceCandy/" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/DolceCandy" : "",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

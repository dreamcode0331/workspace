import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

// The dev server only allows `localhost` by default. Opening it via
// 127.0.0.1 or this machine's LAN IP blocks /_next dev assets, so client
// JS never hydrates (menus, theme toggle, etc. stop working).
// https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
const localIPv4s = Object.values(networkInterfaces())
  .flat()
  .filter((net) => net?.family === "IPv4")
  .map((net) => net!.address);

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: ["127.0.0.1", ...localIPv4s],
};

export default nextConfig;

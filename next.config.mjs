/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  ...(isGithubPages
    ? {
        output: "export",
        basePath: "/spec6",
        assetPrefix: "/spec6",
      }
    : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

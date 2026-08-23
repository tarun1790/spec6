/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  basePath: isGithubPages ? "/spec6" : "",
  assetPrefix: isGithubPages ? "/spec6/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

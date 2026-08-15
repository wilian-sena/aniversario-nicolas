/** @type {import('next').NextConfig} */

// Permite publicar a aplicacao num subdiretorio (ex.: GitHub Pages em /casa-leve).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;

/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://django-api-nextjs-backend:8000/api/:path*", // 👈 use container name
      },
    ];
  },
};


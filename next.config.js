// module.exports = {
//   reactStrictMode: true,
// }
module.exports = (phase) => {
  return {
    async redirects() {
      return [
        {
          source: "/index.html",
          destination: "/api",
          permanent: false,
        },
        {
          source: "/docs",
          destination: "/api",
          permanent: false,
        },
        {
          source: "/",
          destination: "/ba",
          permanent: false,
        },
        {
          source: "/:entity([a-z]{2})",
          destination: "/:entity/dashboard",
          permanent: false,
        },
      ];
    },
    reactStrictMode: false,
    output: "standalone",
  };
};

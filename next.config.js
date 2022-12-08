// module.exports = {
//   reactStrictMode: true,
// }
module.exports = (phase) => {
  return {
    async redirects() {
      return [
        {
          source: "/:entity",
          destination: "/:entity/dashboard",
          permanent: false,
        },
        {
          source: "/",
          destination: "/ba",
          permanent: false,
        },
      ];
    },
    reactStrictMode: false,
    output: "standalone",
  };
};

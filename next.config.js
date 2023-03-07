module.exports = {
  i18n: {
    // providing the locales supported by your application
    locales: ["uz-UZ", "en-US", "ru-RU"],
    //  default locale used when the non-locale paths are visited
    defaultLocale: "uz-UZ",
    localeDetection: false,
  },

  reactStrictMode: true,
  swcMinify: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.mohir.uzbekvoice.ai/:path*", // Proxy to Backend
      },
    ];
  },

  // async redirects() {
  //   return [     
  //     {
  //       source: '/pricing',
  //       destination: '/',
  //       permanent: false,
  //     },
  //   ]
  // },
};

// publicRuntimeConfig: {
//   url: process.env.DIRECTUS_URL,
// },
// serverRuntimeConfig: {
//   email: process.env.DIRECTUS_EMAIL,
//   password: process.env.DIRECTUS_PASSWORD,
//   // token: process.env.DIRECTUS_STATIC_TOKEN,
// },

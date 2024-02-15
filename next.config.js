// // module.exports = async () => {
// //   /**
// //    * @type {import('next').NextConfig}
// //    */
// //   const runtimeCaching = require('next-pwa/cache');
// //   const { i18n } = require('./next-i18next.config');

// //   const nextConfig = {
// //     reactStrictMode: true,
// //     i18n,
// //     pwa: {
// //       disable: process.env.NODE_ENV === 'development',
// //       dest: 'public',
// //       runtimeCaching,
// //     },
// //     images: {
// //       domains: [
// //         'via.placeholder.com',
// //         'res.cloudinary.com',
// //         's3.amazonaws.com',
// //         '18.141.64.26',
// //         '127.0.0.1',
// //         'localhost',
// //         'picsum.photos',
// //         'pickbazar-sail.test',
// //         'pickbazarlaravel.s3.ap-southeast-1.amazonaws.com',
// //         'lh3.googleusercontent.com',
// //         'https://pos-dev.myignite.online/',
// //         'effulgent-mermaid-6cb088.netlify.app',
// //         'pos-dev.myignite.online',
// //         'console.ignitehq.io',
// //         'https://console.ignitehq.io/',
// //       ],
// //     },
// //     ...(process.env.APPLICATION_MODE === 'production' && {
// //       typescript: {
// //         ignoreBuildErrors: true,
// //       },
// //       eslint: {
// //         ignoreDuringBuilds: true,
// //       },
// //     }),
// //     output: 'standalone',
// //   };
// //   return nextConfig;
// // };
// const imageConfig = {
//   images: {
//     minimumCacheTTL: 60,
//     cacheDirectory: '.next/cache/images',
//     maxCacheSize: 50 * 1024 * 1024,
//   },
// };

// const nextConfig = {
//   ...imageConfig,
//   ...async () => {
//     // your original configuration
//   },
// };

// module.exports = nextConfig;

module.exports = async () => {
  /**
   * @type {import('next').NextConfig}
   */
  const runtimeCaching = require('next-pwa/cache');
  const { i18n } = require('./next-i18next.config');

  const nextConfig = {
    reactStrictMode: true,
    i18n,
    pwa: {
      disable: process.env.NODE_ENV === 'development',
      dest: 'public',
      runtimeCaching,
    },
    images: {
      domains: [
        'via.placeholder.com',
        'res.cloudinary.com',
        's3.amazonaws.com',
        '18.141.64.26',
        '127.0.0.1',
        'localhost',
        'picsum.photos',
        'pickbazar-sail.test',
        'pickbazarlaravel.s3.ap-southeast-1.amazonaws.com',
        'lh3.googleusercontent.com',
        'pos-dev.myignite.online',
        'pos-dev.myignite.online/',
        'effulgent-mermaid-6cb088.netlify.app',
        'console.ignitehq.io',
        'console.ignitehq.io/',
        'ignitestorage.blob.core.windows.net',
        "digitaloceanobjects.s3.me-south-1.amazonaws.com",
       
      ],
      // [
      //   'via.placeholder.com',
      //   'res.cloudinary.com',
      //   's3.amazonaws.com',
      //   '18.141.64.26',
      //   '127.0.0.1',
      //   'localhost',
      //   'picsum.photos',
      //   'pickbazar-sail.test',
      //   'pickbazarlaravel.s3.ap-southeast-1.amazonaws.com',
      //   'lh3.googleusercontent.com',
      //   // 'https://pos-dev.myignite.online',
      //   'effulgent-mermaid-6cb088.netlify.app',
      //   'pos-dev.myignite.online',
      //   'console.ignitehq.io',
      //   'https://console.ignitehq.io/',
      //   'ignitestorage.blob.core.windows.net'
      // ],
    },
    ...(process.env.APPLICATION_MODE === 'production' && {
      typescript: {
        ignoreBuildErrors: true,
      },
      eslint: {
        ignoreDuringBuilds: true,
      },
    }),
    output: 'standalone',
  };

  const imagesConfig = {
    images: {
      minimumCacheTTL: 60,
      cacheDirectory: '.next/cache/images',
      maxCacheSize: 50 * 1024 * 1024, // limit cache size to 50 MB
    },
  };

  return {
    ...nextConfig,
    ...imagesConfig,
  };
};

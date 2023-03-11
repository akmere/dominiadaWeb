/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  serverRuntimeConfig: {
    recordingsFolder: "/home/akmere/Projects/dominiadaWeb/recordings"
  }
  // reactStrictMode: true,
  // serverRuntimeConfig: {
  //   recordingsFolder: '/home/akmere/recordings'
  // },
  // publicRuntimeConfig: {
  // }
  // ,
  // withBundleAnalyzer : withBundleAnalyzer
}



module.exports = nextConfig



// module.exports = {
//   async redirects() {
//     return [
//       {
//         source: '/',
//         destination: '/competitions/1516',
//         permanent: true,
//       },
//     ]
//   },
// }

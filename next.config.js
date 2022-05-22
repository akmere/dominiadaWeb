/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    recordingsFolder: '/home/akmere/recordings'
  },
  publicRuntimeConfig: {
  },
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

// @ts-nocheck 
import '../styles/globals.css'
import '../styles/layout.css'
import Layout from '../components/Layout'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'flag-icons'
import type { GetStaticProps, NextPage } from 'next'
import App from 'next/app'
import prisma from '../lib/prisma'

// export async function getServerSideProps(context) {
//   const series = JSON.stringify(
//     await prisma.$queryRaw`SELECT Pk, Name, Type FROM Series;`,
//     (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged    
//   )
//   return {
//     props: {series}, // will be passed to the page component as props
//   }
// }


function MyApp({ Component, pageProps, series, competitions }: AppProps) {
  return (
    <div>
      <Head>
        <title>LaDominiada</title>
        <meta property="og:title" content="LaDominiada" key="title" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <Layout series={series} competitions={competitions}>
        <Component {...pageProps} />
      </Layout>
    </div>)
}

MyApp.getInitialProps = async (appContext) => {
  const series = JSON.stringify(await prisma.$queryRaw`SELECT Pk, Name, Type FROM Series;`);
  const competitions = JSON.stringify(await prisma.$queryRaw`SELECT Pk, Name, SeriesId, Edition FROM Competitions ORDER BY Pk DESC;`);

  const appProps = await App.getInitialProps(appContext)
  return { appProps, series, competitions }
}

export default MyApp

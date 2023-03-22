/* eslint-disable @next/next/no-head-element */
import '../styles/globals.css'
import '../styles/layout.css'
import Layout from '../components/Layout'
import Head from 'next/head'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'flag-icons'
import prisma from '../lib/prisma'
import CookieConsent, { Cookies } from "react-cookie-consent";


export default async function RootLayout({
  children, session
}: {
  children: React.ReactNode;
  session : any;
}) {
  const series = JSON.stringify(await prisma.$queryRaw`SELECT Pk, Name, Type FROM Series;`);
  const competitions = JSON.stringify(await prisma.$queryRaw`SELECT Pk, Name, SeriesId, Edition FROM Competitions ORDER BY Pk DESC;`);
  const players = JSON.stringify(await prisma.$queryRaw`SELECT Pk, Nick, Role FROM Players ORDER BY Pk DESC;`);
  // const appProps = await App.getInitialProps(appContext);

  // const appProps = await App.getInitialProps(appContext)
  // return { appProps, series, competitions, players }

  // return (
  //   <html>
  //     <head></head>
  //     <body>{children}</body>
  //   </html>
  // );

  return (
    <html>
      {/* <CookieConsent>
  This website uses cookies to enhance the user experience.
</CookieConsent> */}
      <body>
        <Layout series={series} competitions={competitions} players={players} session={session}>
          {children}
        </Layout>
      </body>
    </html>
  )
}

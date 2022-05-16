// @ts-nocheck 
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import prisma from '../lib/prisma'
import Layout from '../components/Layout'
import Tabela from '../components/Tabela'

export async function GetStaticProps(context) {
  return {
    props: {}
  }
};

(BigInt.prototype as any).toJSON = function () {
  return Number(this)
};

export async function getServerSideProps(context) {
  const feed = JSON.stringify(
    await prisma.players.findMany(),
    (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged    
  )
  const raw = JSON.stringify(
    await prisma.$queryRaw`SELECT Nick, Goals, Assists, CleanSheets, Appearances FROM Stats WHERE CompetitionName='Sezon13 4v4';`,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged    
  )
  const series = JSON.stringify(
    await prisma.$queryRaw`SELECT Pk, Name, Type FROM Series;`,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged    
  )
  const mak = "lol";
  return {
    props: { feed, raw, series}, // will be passed to the page component as props
  }
}

export default function Home({ message, feed, raw }) {
  feed = JSON.parse(feed);
  raw = JSON.parse(raw);
  // console.log("ID " + feed[0].pk)
  let rows = raw.map((row, index) => ({ id: index, ...row }));
  // console.log('HHAHAH' + rows)
  let columns = Object.keys(raw[0]).map((columnName) => ({ field: columnName, headerName: columnName.toUpperCase(), flex: 1 }));
  // console.log(`feed: ${feed[0].nick}`)
  return (
    <div>
    </div>
  )
}
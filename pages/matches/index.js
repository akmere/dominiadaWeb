import React from 'react'
import prisma from '../../lib/prisma'

export async function getServerSideProps({ }) {
  return {
      props: {}, // will be passed to the page component as props
  }
}
export default function Matches() {
  return (
    <div>Matches
      <a href="/recordings/5940.hbr2"><p>HMMM</p></a>
      <a href="/falafel/index.html"><p>Fafafel</p></a>
      <iframe src="/falafel/index.html" width={'100%'} height={'700px'}></iframe>
    </div>
  )
}

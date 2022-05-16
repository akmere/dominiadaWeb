import React from 'react'
import prisma from '../lib/prisma'

export async function getServerSideProps({ }) {
  return {
      props: {}, // will be passed to the page component as props
  }
}

export default function Archive() {
  return (
    <div>Archive</div>
  )
}

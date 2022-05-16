import React from 'react'
import prisma from '../../lib/prisma'

import Layout from '../../components/Layout'
import { useRouter } from 'next/router'

export default function Match({params}) {
    const router = useRouter();
  return (
    <div>
      <iframe src={`/falafel/costam.html?id=${router.query.id}`} width={'1500px'} height={'850px'}></iframe>
    </div>
  )
}

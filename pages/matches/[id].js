import React from 'react'
import prisma from '../../lib/prisma'

import Layout from '../../components/Layout'
import { useRouter } from 'next/router'

export async function getServerSideProps({ params }) {
  const matchId = parseInt(params.id);
  const match = await prisma.$queryRaw`SELECT *, TO_CHAR(TO_TIMESTAMP(date::VARCHAR(25), 'YYYYMMDDHH24MISS') , 'DD/MM/YYYY, HH24:MI:SS') AS ddate FROM Matches WHERE Pk=${matchId}`;
  const goals = await prisma.$queryRaw`SELECT * FROM Goals WHERE MatchId=${matchId}`;
  const appearances = await prisma.$queryRaw`SELECT * FROM Appearances WHERE MatchId=${matchId}`;
  return {
    props: { match: JSON.stringify(match), goals: JSON.stringify(goals), appearances: JSON.stringify(appearances), },
  }
}

export default function Match({ match, goals, appearances }) {
  match = JSON.parse(match);
  goals = JSON.parse(goals);
  console.log(goals)
  appearances = JSON.parse(appearances);
  const router = useRouter();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>
        <iframe src={`/falafel/costam.html?id=${router.query.id}`} width={'1500px'} height={'850px'}></iframe>
      </div>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '500px' }}>
        <p>{match[0].ddate}</p>
        <p>{match[0].stadium}</p>
        <p>{match[0].format} vs. {match[0].format}</p>        
        <div style={{ display: 'flex', flexDirection: 'row', width:'100%', justifyContent:'center' }}>
          <ul className='players-list' style={{width:'150px', padding: "0", textAlign: 'left'}}>
            {appearances.filter(a => a.team == 1).map(appearance => {
              return (<li>
                {appearance.playername} {appearance.isgk ? `(GK)` : ``}
              </li>)
            })}
          </ul>
          <p style={{width:'100px', textAlign:'center', alignSelf: 'center'}}>Red {match[0].result1}:{match[0].result2} Blue</p>
          <ul className='players-list' style={{ width:'150px', padding: "0", textAlign: 'right' }}>
            {appearances.filter(a => a.team == 2).map(appearance => {
              return (<li>
                {appearance.isgk ? `(GK)` : ``} {appearance.playername} 
              </li>)
            })}
          </ul>
        </div>

        <p>Bramki</p>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <ul className='goal-list'>
            {goals.map(goal => {
              return (<li>
                <p style={{textAlign: 'center'}}>{goal.scorername} {goal.assistername ? `(${goal.assistername})` : ``}</p>
              </li>)
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

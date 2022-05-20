import React from 'react'
import prisma from '../../lib/prisma'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import Link from 'next/link'
import getLink from '../../lib/utilities'

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
  appearances = JSON.parse(appearances);
  const router = useRouter();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>
        <iframe src={`/falafel/costam.html?id=${router.query.id}`} width={'1500px'} height={'850px'}></iframe>
      </div>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '600px' }}>
        <h2>{match[0].ddate}</h2>
        <h3>{match[0].stadium}</h3>
        <h3>{match[0].format} vs. {match[0].format}</h3>        
        <div style={{ display: 'flex', flexDirection: 'row', width:'100%', justifyContent:'center' }}>
          <ul className='players-list' style={{maxWidth:'150px', minWidth:'150px', padding: "0", textAlign: 'left'}}>
            {appearances.filter(a => a.team == 1).map(appearance => {
              return (<li key={appearance.pk}>
                <p>{getLink(appearance.playername, appearance.playerid)} {appearance.isgk ? `(GK)` : ``}</p>
              </li>)
            })}
          </ul>
          <h2 style={{maxWidth:'150px', minWidth:'150px', textAlign:'center', alignSelf: 'center'}}>Red {match[0].result1}:{match[0].result2} Blue</h2>
          <ul className='players-list' style={{ maxWidth:'150px', minWidth:'150px', padding: "0", textAlign: 'right' }}>
            {appearances.filter(a => a.team == 2).map(appearance => {
              return (<li key={appearance.pk}>
                <p>{appearance.isgk ? `(GK)` : ``} {getLink(appearance.playername, appearance.playerid)}</p>
              </li>)
            })}
          </ul>
        </div>

        <h3>Bramki</h3>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <ul className='goal-list'>
            {goals.sort((a,b) => {if(a.time > b.time) return 1; else return -1;}).map(goal => {
              return (<li key={goal.pk} style={{display: 'flex'}}>
                <p style={{fontWeight: 'bold'}}>{Math.floor(goal.time / 60)}:{Math.floor(goal.time % 60)}&nbsp;</p> <p style={{textAlign: 'center'}}> {getLink(goal.scorername, goal.scorer)} {goal.assistername ? <>({getLink(goal.assistername, goal.assister)})</> : ``} {goal.own ? `(OG)` : ``}</p>
              </li>)
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

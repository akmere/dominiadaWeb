import React from 'react'
import prisma from '../../../lib/prisma'
import {getLink} from '../../../lib/utilities'


export default async function Match({ params, searchParams }) {
  const matchId = parseInt(params.id);
  let match = await prisma.$queryRaw`SELECT *, TO_CHAR(TO_TIMESTAMP(date::VARCHAR(25), 'YYYYMMDDHH24MISS') AT TIME ZONE 'Europe/Warsaw', 'DD/MM/YYYY, HH24:MI:SS') AS ddate FROM Matches WHERE Pk=${matchId}`;
  let goals = await prisma.$queryRaw`SELECT * FROM Goals WHERE MatchId=${matchId}`;
  let appearances = await prisma.$queryRaw`SELECT * FROM Appearances WHERE MatchId=${matchId}`;
  let recordingResponse = await fetch(`http://localhost:3000/api/recordings/${matchId}`);
  let recordingAvailable = recordingResponse.status === 200 ? true : false;
  [match, goals, appearances, recordingAvailable] = await Promise.all([match, goals, appearances, recordingAvailable]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>
        <iframe src={`/falafel/costam.html?id=${matchId}`} width={'1500px'} height={'850px'}></iframe>
      </div>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '600px' }}>
        <a className= {recordingAvailable ? `` : `disabled-link`} href={`/api/recordings/${match[0].pk}`}><i style={{color: recordingAvailable ? 'lightgreen' : '#FF7F7F'}} className="bi bi-file-earmark-arrow-down"></i></a>
        <h2>{match[0].ddate}</h2>
        <h3>{match[0].stadium}</h3>
        <h3>{match[0].format} vs. {match[0].format}</h3>        
        <div style={{ display: 'flex', flexDirection: 'row', width:'100%', justifyContent:'center' }}>
          <ul className='players-list' style={{maxWidth:'150px', minWidth:'150px', padding: "0", textAlign: 'left'}}>
            {appearances.filter(a => a.team == 1).map(appearance => {
              return (<li key={appearance.pk}>
                <p>{getLink(appearance.playername, appearance.playerid)} {appearance.isgk && match[0].format > 1  ? `(GK)` : ``}</p>
              </li>)
            })}
          </ul>
          <h2 style={{maxWidth:'150px', minWidth:'150px', textAlign:'center', alignSelf: 'center'}}>Red {match[0].result1}:{match[0].result2} Blue</h2>
          <ul className='players-list' style={{ maxWidth:'150px', minWidth:'150px', padding: "0", textAlign: 'right' }}>
            {appearances.filter(a => a.team == 2).map(appearance => {
              return (<li key={appearance.pk}>
                <p>{appearance.isgk && match[0].format > 1 ? `(GK)` : ``} {getLink(appearance.playername, appearance.playerid)}</p>
              </li>)
            })}
          </ul>
        </div>

        <h3>Bramki</h3>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <ul className='goal-list'>
            {goals.sort((a,b) => {if(a.time > b.time) return 1; else return -1;}).map(goal => {
              return (<li key={goal.pk} style={{display: 'flex'}}>
                <p style={{fontWeight: 'bold'}}>{Math.floor(goal.time / 60)}:{Math.floor(goal.time % 60).toString().padStart(2,'0')}&nbsp;</p> <p style={{textAlign: 'center'}}> {getLink(goal.scorername, goal.scorer)} {goal.assistername ? <>({getLink(goal.assistername, goal.assister)})</> : ``} {goal.own ? `(OG)` : ``}</p>
              </li>)
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

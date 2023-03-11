
// @ts-nocheck 
// 'use server';
// import React from 'react'
import prisma from '../lib/prisma'
import Tabela from '../components/Tabela'
import Tabela2 from '../components/Tabela2'
import Link from 'next/link'
import {getTeamAppearances, getTeamElement, getFullTeamElement, getMatchLinkElement, getDateElement} from '../lib/utilities'
// import { useServer } from 'next/server/core/utils'

// export async function getStaticProps() { 
//     return {
//         props: {
//             matches: JSON.stringify(matches, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
//             appearances: JSON.stringify(appearances, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
//             statistics : statistics,
//         }, 
//         revalidate: 180 // will be passed to the page component as props
//     }
// }

function getRecordingElement(rowData) {
    return (<Link href={`/recordings/${rowData.pk}.hbr2`}><i className="bi bi-file-earmark-arrow-down"></i></Link>)
}

function getMatchElement(rowData) {
  return (<Link href={`/matches/${encodeURIComponent(rowData.pk)}`}>Details</Link>);
}

export default async function Home() {
  let matches = prisma.$queryRaw`SELECT Pk, result1, result2, date, TO_CHAR(TO_TIMESTAMP(date::VARCHAR(25), 'YYYYMMDDHH24MISS') AT TIME ZONE 'Europe/Warsaw', 'DD/MM/YYYY HH24:MI:SS') AS ddate FROM Matches ORDER BY Date DESC LIMIT 100;`;
  let statistics = prisma.$queryRaw`SELECT COUNT(*) AS matchesCount, SUM(result1 + result2) as goalsCount FROM Matches`;
  let playersCount = prisma.$queryRaw`SELECT Count(*) AS playersCount FROM Players;`;
  [matches, statistics, playersCount] = await Promise.all([matches, statistics, playersCount]);
  statistics[0].playerscount = playersCount[0].playerscount;
  let lastDate = matches[99].date;
  let appearances = await prisma.$queryRaw`SELECT Matches.Pk AS Pk, Appearances.* FROM Appearances LEFT JOIN Matches ON Appearances.MatchId = Matches.Pk WHERE Matches.date >= ${lastDate} ORDER BY Matches.Date DESC;`;

  // matches = JSON.stringify(matches, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
  // appearances = JSON.stringify(appearances, (key, value) => (typeof value === 'bigint' ? value.toString() : value))

  // matches = matches ? JSON.parse(matches) : [];
  // appearances = appearances ? JSON.parse(appearances) : [];
  let matchesRows = matches.map((row, index) => ({ id: index, position: index + 1, recording: getMatchLinkElement(row.pk), match: getMatchElement(row), reds: getFullTeamElement(appearances, row.pk, 1), blues: getFullTeamElement(appearances, row.pk, 2), ...row, ddate: getDateElement(row.ddate) }));
  let matchesColumns = [];
  // let matchesColumns = [{ field: 'reds', headerName: "", flex: 1, renderCell: (params, event) => (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>{appearances.filter(appearance => appearance.matchid == params.row.pk && appearance.team == 1).map(appearance => (<p key={appearance.pk} className='player-match-competition'> {appearance.playerid ? (<Link href={`/players/${appearance.playerid}`}>{appearance.playername}</Link>) : appearance.playername}</p>))}</div>)}, { field: 'result1', headerName: "Red", flex: 0.2, align: 'center', headerAlign: 'center' }, { field: 'result2', headerName: "Blue", flex: 0.2, align: 'center', headerAlign: 'center' }, { field: 'blues', headerName: "", flex: 1, renderCell: (params) => (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>{appearances.filter(appearance => appearance.matchid == params.row.pk && appearance.team == 2).map(appearance => (<p key={appearance.pk} className='player-match-competition'>{appearance.playerid ? (<Link href={`/players/${appearance.playerid}`}>{appearance.playername}</Link>) : appearance.playername}</p>))}</div>) }, { field: 'ddate', headerName: "Date", flex: 1 }]
  // matchesColumns.push({ field: 'pk', headerName: "", flex: 0.3, renderCell: (params, event) => (<Link href={`/matches/${encodeURIComponent(params.row.pk)}`}>Details</Link>) });
  // matchesColumns.push({ field: 'pk2', headerName: "Download", flex: 0.3, lol: (<p>hahahaha</p>), renderCell: (params, event) => (<Link href={`/recordings/${params.row.pk}.hbr2`}><i className="bi bi-file-earmark-arrow-down"></i></Link>) });
  // matchesColumns.push({field: "recording", headerName: "Recording"});
  matchesColumns.push({field: "reds", headerName: "", flex: '0.5fr'});
  matchesColumns.push({field: "result1", headerName: "Red", flex: '0.2fr'});
  matchesColumns.push({field: "result2", headerName: "Blue", flex: '0.2fr'});
  matchesColumns.push({field: "blues", headerName: "", flex: '0.5fr'});
  matchesColumns.push({field: "ddate", headerName: "Date", flex: '0.5fr'});
  matchesColumns.push({field: "match", headerName: "Match", flex: '0.3fr'});
  // matchesColumns.push({field: "blues", headerName: "Match"});
  // matchesColumns.push({field: "reds", headerName: "Match"});
  matchesColumns.forEach(matchColumn => matchColumn.renderCell = null);
  return (
    <main className='index-main'>
      <div className='index-grid'>
        <div className='card'> 
          <i className="bi bi-activity counter-icon"></i>
          <p className='statistics-number'>{statistics[0].matchescount}</p>
          <p className='counter-title'>Mecze</p>
        </div>
        <div className='card'>
          <i className="bi bi-arrow-through-heart-fill counter-icon"></i>
          <p className='statistics-number'>{statistics[0].goalscount}</p>
          <p className='counter-title'>Bramki</p>
        </div>
        <div className='card'>
          <i className="bi bi-emoji-heart-eyes counter-icon"></i>
          <p className='statistics-number'>{statistics[0].playerscount}</p>
          <p className='counter-title'>Zawodnicy</p>
        </div>
        {/* <h2>Witamy na LaDominiadzie!</h2> */}
        {/* <p>Gramy w Haxballa od 2020 roku. Przez większość czasu naszym najpopularnieszym formatem był Huge 4v4.</p> */}
        {/* <p style={{textAlign: 'center'}}>Nasze ligi polegają na liczeniu statystyk zawodników na roomie w określonych godzinach.</p>  */}
        {/* <p style={{textAlign: 'center'}}>Roomy ligowe są publiczne i działają na zasadzie wybierania nowych składów co mecz.</p> */}
        {/* <p style={{textAlign: 'center'}}>Regularnie rozgrywamy również turnieje o zróżnicowanych zasadach i nagrodach!</p> */}
      </div>
      <div className='card' >
        <h3>Ostatnie mecze</h3>
        {/* <Tabela rows={matchesRows} rowHeight={4   * 30} subtitle="" columns={matchesColumns} height={120 + 4 * 30 * 3} pageSize={3} /> */}
        {<Tabela2 rows={matchesRows} columns={matchesColumns} pageSize={3} minWidth={'400px'} rowHeight={4*30}px/>}
      </div>
    </main>

  )
}
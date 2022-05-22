// @ts-nocheck 
import React from 'react'
// import { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import prisma from '../lib/prisma'
import Layout from '../components/Layout'
import Tabela from '../components/Tabela'
import Link from 'next/link'
import { EditNotifications } from '@mui/icons-material'
import { useRouter } from 'next/router'

export async function getStaticProps() { 
    const matches = await prisma.$queryRaw`SELECT Pk, result1, result2, date, TO_CHAR(TO_TIMESTAMP(date::VARCHAR(25), 'YYYYMMDDHH24MISS') AT TIME ZONE 'Europe/Warsaw', 'DD/MM/YYYY, HH24:MI:SS') AS ddate FROM Matches ORDER BY Date DESC LIMIT 100;`;
    const statistics = await prisma.$queryRaw`SELECT COUNT(*) AS matchesCount, SUM(result1 + result2) as goalsCount FROM Matches`;
    const playersCount = await prisma.$queryRaw`SELECT Count(*) AS playersCount FROM Players;`
    statistics[0].playerscount = playersCount[0].playerscount;
    let lastDate = matches[99].date;
    const appearances = await prisma.$queryRaw`SELECT Matches.Pk AS Pk, Appearances.* FROM Appearances LEFT JOIN Matches ON Appearances.MatchId = Matches.Pk WHERE Matches.date >= ${lastDate} ORDER BY Matches.Date DESC;`;

    return {
        props: {
            matches: JSON.stringify(matches, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
            appearances: JSON.stringify(appearances, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
            statistics : statistics,
        }, 
        revalidate: 180 // will be passed to the page component as props
    }
}

function Home({ matches, appearances, statistics }) {
    let router = useRouter();
    matches = matches ? JSON.parse(matches) : [];
    appearances = appearances ? JSON.parse(appearances) : [];
    let matchesRows = matches.map((row, index) => ({ id: index, position: index + 1, ...row }));  
    let matchesColumns = [{field: 'reds', headerName: "", flex:1,renderCell: (params) => (<div style={{display:'flex', flexDirection:'column', alignItems: 'center', width: '100%'}}>{appearances.filter(appearance => appearance.matchid == params.row.pk && appearance.team == 1).map(appearance => (<p key={appearance.pk} className='player-match-competition'> {appearance.playerid ? (<Link href={`/players/${appearance.playerid}`}>{appearance.playername}</Link>) : appearance.playername}</p>))}</div>)},{field: 'result1', headerName: "Red", flex:0.2, align: 'center', headerAlign: 'center'},{field: 'result2', headerName: "Blue", flex: 0.2, align: 'center', headerAlign: 'center'},{field: 'blues', headerName: "", flex:1, renderCell: (params) => (<div style={{display:'flex', flexDirection:'column', alignItems: 'center', width: '100%'}}>{appearances.filter(appearance => appearance.matchid == params.row.pk && appearance.team == 2).map(appearance => (<p key={appearance.pk} className='player-match-competition'>{appearance.playerid ? (<Link href={`/players/${appearance.playerid}`}>{appearance.playername}</Link>) : appearance.playername}</p>))}</div>)},{field: 'ddate', headerName: "Date", flex: 1}]
    matchesColumns.push({field: 'pk', headerName: "", flex: 0.3, renderCell: (params) => (<Link href={`/matches/${encodeURIComponent(params.row.pk)}`}>Details</Link>)});
    // matchesColumns.push({ field: 'pk2', headerName: "Download", flex: 0.3, renderCell: (params) => (<Link href={`/recordings/${params.row.pk}.hbr2`}><i className="bi bi-file-earmark-arrow-down"></i></Link>) });
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
                    {/* <p style={{textAlign: 'center'}}>Regularnie rozgrywamy również turnieje o zróżnicowanych zasadach i nagrodach!</p> */ }
            </div>
            <div className='card' >
                <h3>Ostatnie mecze</h3>
                <Tabela rows={matchesRows} rowHeight={4 * 30} subtitle = "" columns={matchesColumns} height={120 + 4 * 30 * 3} pageSize={3} />
            </div>
        </main>

    )
}

export default Home
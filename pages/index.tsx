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
    const matches = await prisma.$queryRaw`SELECT Pk, result1, result2, date, TO_CHAR(TO_TIMESTAMP(date::VARCHAR(25), 'YYYYMMDDHH24MISS'), 'DD/MM/YYYY, HH24:MI:SS') AS ddate FROM Matches ORDER BY Date DESC LIMIT 100;`;
    let lastDate = matches[99].date;
    const appearances = await prisma.$queryRaw`SELECT Matches.Pk AS Pk, Appearances.* FROM Appearances LEFT JOIN Matches ON Appearances.MatchId = Matches.Pk WHERE Matches.date >= ${lastDate} ORDER BY Matches.Date DESC;`;

    return {
        props: {
            matches: JSON.stringify(matches, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
            appearances: JSON.stringify(appearances, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
        }, // will be passed to the page component as props
    }
}

function Home({ matches, appearances }) {
    let router = useRouter();
    matches = matches ? JSON.parse(matches) : [];
    appearances = appearances ? JSON.parse(appearances) : [];
    let matchesRows = matches.map((row, index) => ({ id: index, position: index + 1, ...row }));  
    let matchesColumns = [{field: 'reds', headerName: "", flex:1,renderCell: (params) => (<div style={{display:'flex', flexDirection:'column', alignItems: 'center', width: '100%'}}>{appearances.filter(appearance => appearance.matchid == params.row.pk && appearance.team == 1).map(appearance => (<p className='player-match-competition'> {appearance.playerid ? (<Link href={`/players/${appearance.playerid}`}>{appearance.playername}</Link>) : appearance.playername}</p>))}</div>)},{field: 'result1', headerName: "Red", flex:0.2, align: 'center', headerAlign: 'center'},{field: 'result2', headerName: "Blue", flex: 0.2, align: 'center', headerAlign: 'center'},{field: 'blues', headerName: "", flex:1, renderCell: (params) => (<div style={{display:'flex', flexDirection:'column', alignItems: 'center', width: '100%'}}>{appearances.filter(appearance => appearance.matchid == params.row.pk && appearance.team == 2).map(appearance => (<p className='player-match-competition'>{appearance.playerid ? (<Link href={`/players/${appearance.playerid}`}>{appearance.playername}</Link>) : appearance.playername}</p>))}</div>)},{field: 'ddate', headerName: "Date", flex: 1}]
    matchesColumns.push({field: 'pk', headerName: "", flex: 0.3, renderCell: (params) => (<a href={`/matches/${encodeURIComponent(params.row.pk)}`}>Details</a>)});
    return (
        <main className='index-main'>
            <div className='card' >
                <h3>Ostatnie mecze</h3>
                <Tabela rows={matchesRows} rowHeight={4 * 30} subtitle = "" columns={matchesColumns} height={120 + 4 * 30 * 3} pageSize={3} />
            </div>
        </main>

    )
}

export default Home
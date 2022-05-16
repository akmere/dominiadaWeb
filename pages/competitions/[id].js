import React from 'react'
// import { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import prisma from '../../lib/prisma'
import Layout from '../../components/Layout'
import Tabela from '../../components/Tabela'
import Link from 'next/link'
import { EditNotifications } from '@mui/icons-material'
import { useRouter } from 'next/router'

export async function getStaticProps({ params }) {
    params.id = parseInt(params.id);
    const raw = await prisma.$queryRaw`SELECT Nick, Goals, Assists, CleanSheets, LostGoals, ExtraWins AS Wins, ExtraDraws AS Draws, ExtraLosses AS Losses, Appearances, CASE WHEN Appearances > 0 THEN ROUND(CAST(ExtraWins AS decimal)/Appearances, 4) * 100 ELSE NULL END AS WinRate, CASE WHEN Gka>0 THEN (ROUND(CAST(CleanSheets AS decimal)/Gka, 4) * 100) ELSE NULL END AS CSPercent, ROUND(Points) AS Points, ROUND(GkPoints) AS GkPoints, GKa FROM Stats WHERE CompetitionId=${params.id} ORDER BY Points DESC, Goals DESC, Assists DESC, CleanSheets DESC, Appearances ASC;`;
    const cData = await prisma.$queryRaw`SELECT Series.Name AS Name, Competitions.TagId AS TagId, Series.Pk AS SeriesId, Series.Type AS Type, Competitions.Edition AS Edition FROM Competitions LEFT JOIN Series ON Competitions.SeriesId = Series.Pk WHERE Competitions.Pk = ${params.id};`;
    const editions = await prisma.$queryRaw`SELECT Pk, Edition FROM Competitions WHERE SeriesId=${cData[0].seriesid} ORDER BY Edition DESC;`;
    const matches = await prisma.$queryRaw`SELECT Pk, result1, result2, TO_CHAR(TO_TIMESTAMP(date::VARCHAR(25), 'YYYYMMDDHH24MISS'), 'DD/MM/YYYY, HH24:MI:SS') AS ddate FROM Matches WHERE Pk IN (SELECT MatchId FROM Matches_Tags WHERE TagId=${cData[0].tagid}) ORDER BY Date DESC;`;



    let gkAppsMargin = 1;
    if(cData[0].type == 'liga') gkAppsMargin = 20;

    const gkData = raw.slice().filter((row) => row.gka >= gkAppsMargin).sort((a, b) => { if ((cData[0].type == 'liga' && (a.gkpoints > b.gkpoints)) || (cData[0].type != 'liga' && a.cleansheets > b.cleansheets)) return -1; else return 1; })
    const scorersData = raw.slice().filter(row => row.goals > 0).sort((a, b) => { if (a.goals > b.goals || (a.goals == b.goals && a.assists > b.assists)) return -1; else return 1; })
    const general = raw.slice().sort((a, b) => { if (a.points > b.points) return -1; else return 1; })

    return {
        props: {
            raw: JSON.stringify(general, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
            cData: JSON.stringify(cData),
            editions: JSON.stringify(editions),
            gkData: JSON.stringify(gkData, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
            scorersData: JSON.stringify(scorersData, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
            matches: JSON.stringify(matches, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
        }, // will be passed to the page component as props
    }
}

export async function getStaticPaths() {
    const competitionsIdis = await prisma.$queryRaw`SELECT Pk FROM Competitions;`;

    console.log("OTO " + competitionsIdis[0].pk);

    const paths = competitionsIdis.map(post => ({
        params: { id: post.pk.toString() },
    }));

    return { paths, fallback: true }
}


function Competition({ feed, raw, cData, editions, gkData, scorersData, matches }) {
    let router = useRouter();
    raw = JSON.parse(raw);
    cData = JSON.parse(cData);
    editions = JSON.parse(editions);
    gkData = JSON.parse(gkData);
    scorersData = JSON.parse(scorersData);
    matches = JSON.parse(matches);
    let startDate = matches[matches.length - 1].ddate.substring(0, 10);
    let endDate = matches[0].ddate.substring(0, 10);
    let rows = raw.map((row, index) => ({ id: index, position: index + 1, ...row }));
    let gkRows = gkData.map((row, index) => ({ id: index, position: index + 1, ...row }));
    let scorersRows = scorersData.map((row, index) => ({ id: index, position: index + 1, ...row }));
    let matchesRows = matches.map((row, index) => ({ id: index, position: index + 1, ...row }));
    let columns = Object.keys(raw[0]).map((columnName) => {
        if (columnName != "nick") return ({ field: columnName, headerName: columnName.toUpperCase(), flex: 1 });
        else return ({ field: columnName, headerName: columnName.toUpperCase(), flex: 1, renderCell: (params, event) => (<Link href={`/players/${encodeURIComponent(params.value)}`}>{params.value}</Link>) });
    }
    );
    let generalColumns = [{ field: 'position', headerName: "#", flex: 0.1 }, { field: "nick", headerName: "Nick", flex: 1, renderCell: (params, event) => (<Link href={`/players/${encodeURIComponent(params.value)}`}>{params.value}</Link>)  }, { field: "appearances", headerName: "Apps", flex: 0.5  }, { field: "goals", headerName: "Goals", flex: 0.5  }, { field: "assists", headerName: "Assists", flex: 0.5  }, { field: "cleansheets", headerName: "CS", flex: 0.5 }, { field: "wins", headerName: "W", flex: 0.1}, , { field: "draws", headerName: "D", flex: 0.1}, { field: "losses", headerName: "L", flex: 0.1 }];
    let scorersColumns = [{ field: 'position', headerName: "#", flex: 0.1 }, { field: "nick", headerName: "Nick", flex: 1, renderCell: (params, event) => (<Link href={`/players/${encodeURIComponent(params.value)}`}>{params.value}</Link>) }, { field: "goals", headerName: "Goals", flex: 0.5  }, { field: "assists", headerName: "Assists", flex: 0.5  }];
    let gkColumns = [{ field: 'position', headerName: "#", flex: 0.3 }, { field: "nick", headerName: "Nick", flex: 1, renderCell: (params, event) => (<Link href={`/players/${encodeURIComponent(params.value)}`}>{params.value}</Link>) }, { field: "gka", headerName: "GKA", flex: 0.5 }, { field: "cleansheets", headerName: "CS", flex: 0.5 }, { field: "cspercent", headerName: "%CS", flex: 0.7 }, { field: "lostgoals", headerName: "LG", flex: 0.5 }];
    let matchesColumns = [{field: 'result1', headerName: "Red", flex:0.2},{field: 'result2', headerName: "Blue", flex: 0.2},{field: 'ddate', headerName: "Date", flex: 1}]
    matchesColumns.push({field: 'pk', headerName: "", flex: 0.3, renderCell: (params) => (<a href={`/matches/${encodeURIComponent(params.row.pk)}`}>Details</a>)});
    if (cData[0].type == 'liga') 
    {
        generalColumns.push({ field: "winrate", headerName: "%W", flex: 0.5  });
        generalColumns.push({ field: "points", headerName: "Points", flex: 0.5  });
        gkColumns.push({ field: "gkpoints", headerName: "Points", flex: 0.7 });
    }
    columns.unshift({ field: "position", headerName: "#", flex: 0.3 });
    return (
        <main className='competition-main'>
            <div className='card'>
                <div className='tableContainer' style={{ fontSize: "1.5rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
                    <p>{cData[0].name}</p>
                    <p>Edycja</p>
                    <select className='selectEdition' defaultValue={cData[0].edition} onChange={(e) => {
                        var cid = JSON.stringify(editions.filter(edition => edition.edition == e.target.value)[0].pk);
                        router.push(`/competitions/${cid}`)
                    }}>
                        {editions.map(edition => (<option key={edition.pk} value={edition.edition}>{edition.edition}</option>))};
                    </select>
                </div>
                <Tabela rows={rows} columns={generalColumns} pageSize={10} rowHeight={52}/>
            </div>
            <div className='card'>
                <Tabela rows={scorersRows} rowHeight={30} subtitle = "" columns={scorersColumns} height="100%" pageSize={3} />
            </div>
            <div className='card'>
                {/* <h3>Najlepsi bramkarze</h3> */}
                <Tabela rows={gkRows} rowHeight={30} subtitle = "" columns={gkColumns} height="100%" pageSize={3} />
            </div>
            <div className='card'>
                {/* <h3>Mecze</h3> */}
                <Tabela rows={matchesRows} rowHeight={30} subtitle = "" columns={matchesColumns} height="100%" pageSize={3} />
            </div>
        </main>

    )
}

export default Competition
import React from 'react'
// import { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import prisma from '../../../lib/prisma'
import Layout from '../../../components/Layout'
import Tabela from '../../../components/Tabela'
import Tabela2 from '../../../components/Tabela2'
import Link from 'next/link'
import SelectCompetition from '../../../components/SelectCompetition'
import {getTeamAppearances, getTeamElement, getFullTeamElement, getMatchLinkElement, getLink, getDateElement} from '../../../lib/utilities'
// import { EditNotifications } from '@mui/icons-material'
// import { useRouter } from 'next/navigation'
// import { Tooltip } from '@mui/material'

// export async function getStaticPaths() {
//     const competitionsIdis = await prisma.$queryRaw`SELECT Pk FROM Competitions;`;

//     const paths = competitionsIdis.map(post => ({
//         params: { id: post.pk.toString() },
//     }));

//     return { paths, fallback: true }
// }

export default async function Competition({params, searchParams}) {
    let competitionId = parseInt(params.id);
    let cData = await prisma.$queryRaw`SELECT Goal, Assist, Win, Draw, Loss, CleanSheet, Competitions.Format AS Format, Series.Name AS Name, Competitions.TagId AS TagId, Series.Pk AS SeriesId, Series.Type AS Type, Competitions.Edition AS Edition FROM Competitions LEFT JOIN Series ON Competitions.SeriesId = Series.Pk WHERE Competitions.Pk = ${competitionId};`;    
    let raw = prisma.$queryRaw`SELECT PlayerId, Nick, Goals, Assists, CleanSheets, LostGoals, ExtraWins AS Wins, ExtraDraws AS Draws, ExtraLosses AS Losses, Appearances, CASE WHEN Appearances > 0 THEN ROUND(CAST(ExtraWins AS decimal)/Appearances, 4) * 100 ELSE NULL END AS WinRate, CASE WHEN Gka>0 THEN (ROUND(CAST(CleanSheets AS decimal)/Gka, 4) * 100) ELSE NULL END AS CSPercent, ROUND(Points) AS Points, ROUND(GkPoints) AS GkPoints, GKa FROM Stats WHERE CompetitionId=${competitionId} ORDER BY Points DESC, Goals DESC, Assists DESC, CleanSheets DESC, Appearances ASC;`;    
    let editions = prisma.$queryRaw`SELECT Pk, Edition FROM Competitions WHERE SeriesId=${cData[0].seriesid} ORDER BY Edition DESC;`;
    let matches = prisma.$queryRaw`SELECT Pk, result1, result2, TO_CHAR(TO_TIMESTAMP(date::VARCHAR(25), 'YYYYMMDDHH24MISS') AT TIME ZONE 'Europe/Warsaw', 'DD/MM/YYYY, HH24:MI:SS') AS ddate FROM Matches WHERE Pk IN (SELECT MatchId FROM Matches_Tags WHERE TagId=${cData[0].tagid}) ORDER BY Date DESC;`;
    let appearances = prisma.$queryRaw`SELECT Appearances.* FROM Appearances LEFT JOIN Matches ON Appearances.MatchId = Matches.Pk LEFT JOIN Matches_Tags ON Matches.Pk = Matches_Tags.MatchId WHERE Matches_Tags.TagId=${cData[0].tagid} ORDER BY Matches.Date DESC;`;
    [raw, editions, matches, appearances] = await Promise.all([raw, editions, matches, appearances]);
    // console.log(`cData: ${JSON.stringify(cData)}`);
    // console.log(`editions: ${JSON.stringify(editions)}`);
    // console.log(`matches: ${JSON.stringify(matches)}`);
    // console.log(`appearances: ${JSON.stringify(appearances)}`);

    let gkAppsMargin = 1;
    if(cData[0].type == 'liga') gkAppsMargin = 20;
    if(cData[0].type == 'ranking') {
        raw.map(p => p.ranking = appearances.filter(a => a.playerid == p.playerid)[0].ranking);
        raw.sort((a,b) => a.ranking == b.ranking ? 0 : a.ranking > b.ranking ? -1 : 1);
    }

    let gkData = raw.slice().filter((row) => row.gka >= gkAppsMargin).sort((a, b) => { if ((cData[0].type == 'liga' && (a.gkpoints > b.gkpoints)) || (cData[0].type != 'liga' && a.cleansheets > b.cleansheets)) return -1; else return 1; })
    let scorersData = raw.slice().filter(row => row.goals > 0).sort((a, b) => { if (a.goals > b.goals || (a.goals == b.goals && a.assists > b.assists)) return -1; else return 1; })
    let general = raw.slice().sort((a, b) => { if (a.points > b.points) return -1; else return 1; })

    // raw = JSON.stringify(general, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
    // cData = JSON.stringify(cData)
    // editions = JSON.stringify(editions)
    // gkData =JSON.stringify(gkData, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
    // scorersData = JSON.stringify(scorersData, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
    // matches= JSON.stringify(matches, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
    // appearances = JSON.stringify(appearances, (key, value) => (typeof value === 'bigint' ? value.toString() : value))

    // // let router = useRouter();
    // raw = raw? JSON.parse(raw) : [];
    // cData = cData ? JSON.parse(cData) : [{name : "undefined"}];
    // editions = editions ? JSON.parse(editions) : [];
    // gkData = gkData ? JSON.parse(gkData) : [];
    // scorersData = scorersData ? JSON.parse(scorersData) : [] ;
    // matches = matches ? JSON.parse(matches) : [];
    // appearances = appearances ? JSON.parse(appearances) : [];
    let startDate = matches[0] ? matches[matches.length - 1].ddate.substring(0, 10) : "";
    let endDate = matches[0] ? matches[0].ddate.substring(0, 10) : "";
    let intervalString = startDate == endDate ? `${startDate}` : `${startDate} - ${endDate}`

    let pointsText = `(${cData[0].goal} * G + ${cData[0].assist} * A + ${cData[0].cleansheet} * CS + ${cData[0].win} * W + ${cData[0].draw} * D + ${cData[0].loss} * L) * %W`;
    let rows = raw.map((row, index) => ({ id: index, position: index + 1, ...row, nick: getLink(row.nick, row.playerid)}));
    let gkRows = gkData.map((row, index) => ({ id: index, position: index + 1, ...row, nick: getLink(row.nick, row.playerid) }));
    let scorersRows = scorersData.map((row, index) => ({ id: index, position: index + 1, ...row,  nick: getLink(row.nick, row.playerid) }));
    let matchesRows = matches.map((row, index) => ({ id: index, position: index + 1, ...row, reds: getFullTeamElement(appearances, row.pk, 1), ddate : getDateElement(row.ddate),blues: getFullTeamElement(appearances, row.pk, 2), details: getMatchLinkElement(row.pk) }));
    // let columns = Object.keys(raw[0]).map((columnName) => {
    //     if (columnName != "nick") return ({ field: columnName, headerName: columnName.toUpperCase(), flex: 1 });
    //     else return ({ field: columnName, headerName: columnName.toUpperCase(), flex: 1, renderCell: (params, event) => (<Link href={`/players/${encodeURIComponent(params.value)}`}>{params.value}</Link>) });
    // }
    // );
    // let generalColumns = [{ field: 'position', headerName: "#", flex: 0.1 }, { field: "nick", headerName: "Nick", flex: 1, renderCell: (params, event) => (<Link href={`/players/${encodeURIComponent(params.row.playerid)}`}>{params.value}</Link>)  }, { field: "appearances", headerName: "Apps", flex: 0.5  }, { field: "goals", headerName: "Goals", flex: 0.5  }, { field: "assists", headerName: "Assists", flex: 0.5  }, { field: "cleansheets", headerName: "CS", flex: 0.5 }, { field: "wins", headerName: "W", flex: 0.1}, , { field: "draws", headerName: "D", flex: 0.1}, { field: "losses", headerName: "L", flex: 0.1 }];
    // let scorersColumns = [{ field: 'position', headerName: "#", flex: 0.1 }, { field: "nick", headerName: "Nick", flex: 1, renderCell: (params, event) => (<Link href={`/players/${encodeURIComponent(params.row.playerid)}`}>{params.value}</Link>) }, { field: "goals", headerName: "Goals", flex: 0.5  }, { field: "assists", headerName: "Assists", flex: 0.5  }];
    // let gkColumns = [{ field: 'position', headerName: "#", flex: 0.3 }, { field: "nick", headerName: "Nick", flex: 1, renderCell: (params, event) => (<Link href={`/players/${encodeURIComponent(params.row.playerid)}`}>{params.value}</Link>) }, { field: "gka", headerName: "GKA", flex: 0.5 }, { field: "cleansheets", headerName: "CS", flex: 0.5 }, { field: "cspercent", headerName: "%CS", flex: 0.7 }, { field: "lostgoals", headerName: "LG", flex: 0.5 }];
    // let matchesColumns = [{field: 'reds', headerName: "", flex:1,renderCell: (params) => (<div style={{display:'flex', flexDirection:'column', alignItems: 'center', width: '100%'}}>{appearances.filter(appearance => appearance.matchid == params.row.pk && appearance.team == 1).map(appearance => (<p key={appearance.pk} className='player-match-competition'> {appearance.playerid ? (<Link href={`/players/${appearance.playerid}`}>{appearance.playername}</Link>) : appearance.playername}</p>))}</div>)},{field: 'result1', headerName: "Red", flex:0.2, align: 'center', headerAlign: 'center'},{field: 'result2', headerName: "Blue", flex: 0.2, align: 'center', headerAlign: 'center'},{field: 'blues', headerName: "", flex:1, renderCell: (params) => (<div style={{display:'flex', flexDirection:'column', alignItems: 'center', width: '100%'}}>{appearances.filter(appearance => appearance.matchid == params.row.pk && appearance.team == 2).map(appearance => (<p key={appearance.pk} className='player-match-competition'>{appearance.playerid ? (<Link href={`/players/${appearance.playerid}`}>{appearance.playername}</Link>) : appearance.playername}</p>))}</div>)},{field: 'ddate', headerName: "Date", flex: 1}]
    // matchesColumns.push({field: 'pk', headerName: "", flex: 0.3, renderCell: (params) => (<Link href={`/matches/${encodeURIComponent(params.row.pk)}`}>Details</Link>)});
    let generalColumns = [{ field: 'position', headerName: "#", flex: 0.5 }, { field: "nick", headerName: "Nick", flex: 1 }, { field: "appearances", headerName: "Apps", flex: 0.5  }, { field: "goals", headerName: "Goals", flex: 0.5  }, { field: "assists", headerName: "Assists", flex: 0.5  }, { field: "cleansheets", headerName: "CS", flex: 0.5 }, { field: "wins", headerName: "W", flex: 0.5}, { field: "draws", headerName: "D", flex: 0.5}, { field: "losses", headerName: "L", flex: 0.5 }];
    let scorersColumns = [{ field: 'position', headerName: "#", flex: 0.5 }, { field: "nick", headerName: "Nick", flex: 1}, { field: "goals", headerName: "Goals", flex: 0.5  }, { field: "assists", headerName: "Assists", flex: 0.5  }];
    let gkColumns = [{ field: 'position', headerName: "#", flex: 0.5 }, { field: "nick", headerName: "Nick", flex: 1}, { field: "gka", headerName: "GKA", flex: 0.5 }, { field: "cleansheets", headerName: "CS", flex: 0.5 }, { field: "cspercent", headerName: "%CS", flex: 0.7 }, { field: "lostgoals", headerName: "LG", flex: 0.5 }];
    let matchesColumns = [{field: 'reds', headerName: "", flex:1},{field: 'result1', headerName: "Red", flex:0.2, align: 'center', headerAlign: 'center'},{field: 'result2', headerName: "Blue", flex: 0.2, align: 'center', headerAlign: 'center'},{field: 'blues', headerName: "", flex:1},{field: 'ddate', headerName: "Date", flex: 0.75},{field: 'details', headerName: "", flex: 0.5}]
    // matchesColumns.push({field: 'pk', headerName: "", flex: 0.3, }`}>Details</Link>)});
    // matchesColumns.push({ field: 'pk2', headerName: "Download", flex: 0.3, renderCell: async (params) => {
    //     const recordingAvailable = await (await fetch(`http://localhost:3000/api/recordings/${matchId}`)).json();
    //     (<Link href={`/recordings/${params.row.pk}.hbr2`}><i className={`bi bi-file-earmark-arrow-down ` + recordingAvailable ? 'existing-recording' : 'nonexisting-recording'}></i></Link>)}
    //  });
    if (cData[0].type == 'liga') 
    {
        generalColumns.push({ field: "winrate", headerName: "%W", flex: 0.5  });
        // generalColumns.push({ field: "points", headerName: "Points", flex: 0.5, renderHeader: (params) => (
        //     <></>
        //     // cData[0].type == 'liga' ? <Tooltip title={pointsText}><strong>Points</strong></Tooltip> : <strong>Points</strong>            
        // )  });
        generalColumns.push({ field: "points", headerName: "Points", flex: 0.5,});
        gkColumns.push({ field: "gkpoints", headerName: "Points", flex: 0.7 });
    }
    if(cData[0].type == 'ranking') {
        generalColumns.push({ field: "winrate", headerName: "%W", flex: 0.5  });
        generalColumns.push({ field: "ranking", headerName: "ELO", flex: 0.5});
    }
    return (
        <main className='competition-main'>
            <div className='card'>
                <div className='tableContainer' style={{ fontSize: "1.5rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
                    <p>{cData[0].name}</p>
                    <p>Edycja</p>
                    <SelectCompetition editions={editions} defaultValue={cData[0].edition}></SelectCompetition>
                <p>{intervalString}</p>
                </div>
                {/* {cData[0].type == "liga" ? <div className='competition-rules'><p>{`Points = %W * (${cData[0].goal} * Goals + ${cData[0].assist} * Assists + ${cData[0].cleansheet} * CS + ${cData[0].win} * W + ${cData[0].draw} * D + ${cData[0].loss} * L)`}</p></div> : ``} */}
                <Tabela2 rows={rows} columns={generalColumns} pageSize={10} rowHeight={52} minWidth={'600px'}/>
            </div>
            <div className='card'>
                <h3>Najlepsi strzelcy</h3>
                <Tabela2 rows={scorersRows} rowHeight={52} subtitle = "" columns={scorersColumns} height="100%" pageSize={3} minWidth={'400px'}/>
            </div>
            <div className='card'>
                <h3>Najlepsi bramkarze</h3>
                <Tabela2 rows={gkRows} rowHeight={52} subtitle = "" columns={gkColumns} height="100%" pageSize={3} minWidth={'400px'}/>
            </div>
            <div className='card' >
                <h3>Mecze</h3>
                <Tabela2 rows={matchesRows} rowHeight={Math.max(2, cData[0].format) * 30} subtitle = "" columns={matchesColumns} pageSize={3} />
            </div>
        </main>

    )
}
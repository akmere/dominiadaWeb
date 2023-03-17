//@ts-nocheck

import Link from 'next/link';
import React from 'react'
import Layout from '../../../components/Layout'
import Tabela from '../../../components/Tabela';
import Tabela2 from '../../../components/Tabela2';
import prisma from '../../../lib/prisma'
import { getPlayerMatchDetailsElement, getFullTeamElement, getMatchLinkElement, getDateElement} from '../../../lib/utilities';

export const revalidate = 60;

function getMatchResult(appearance, match) {
    let result = match.result1 > match.result2 ? 1 : match.result1 < match.result ? 2 : 0;
    if (result === 0) return 0;
    if (appearance.team === result) return 1;
    else return -1;
}

export default async function Player({ params, searchParams }) {
    params.id = parseInt(params.id);

    let player = prisma.$queryRaw`SELECT Pk, Nick FROM Players WHERE Pk=${params.id}`;
    let matches = prisma.$queryRaw`SELECT Appearances.Ranking AS Ranking, Matches.Pk AS Pk, result1, result2, format, stadium, TO_CHAR(TO_TIMESTAMP(date::VARCHAR(25), 'YYYYMMDDHH24MISS') AT TIME ZONE 'Europe/Warsaw', 'DD/MM/YYYY, HH24:MI:SS') AS ddate, team, (CASE WHEN (result1>result2 AND team=1) OR (result2>result1 AND team=2) THEN 'win' WHEN result1=result2 THEN 'draw' ELSE 'loss' END) AS result, (CASE WHEN Appearances.isGk = 1 AND ((team = 1 AND result2 = 0) OR (team = 2 AND result1=0)) THEN true ELSE false END) AS cs FROM Matches LEFT JOIN Appearances ON Matches.Pk = Appearances.MatchId WHERE Appearances.PlayerId=${params.id} ORDER BY date DESC`;
    let goals = prisma.$queryRaw`SELECT MatchId FROM Goals WHERE Scorer=${params.id} AND Own=0;`
    let assists = prisma.$queryRaw`SELECT MatchId FROM Goals WHERE Assister=${params.id};`
    let results = prisma.$queryRaw`SELECT CompetitionId, Ended, SeriesId, Edition, Position, Series.Name AS Name, Series.Type AS Type, Appearances, Goals, Assists, Wins, Draws, Losses, CleanSheets, GkA, CASE WHEN Appearances > 0 THEN ROUND(CAST(ExtraWins AS decimal)/Appearances, 4) * 100 ELSE NULL END AS WinRate, CASE WHEN Gka>0 THEN (ROUND(CAST(CleanSheets AS decimal)/Gka, 4) * 100) ELSE NULL END AS CSPercent FROM Stats LEFT JOIN Series ON Series.Pk = SeriesId WHERE PlayerId=${params.id} AND Name IS NOT NULL ORDER BY Name ASC, Edition DESC;`;
    let rankings = prisma.$queryRaw`SELECT CompetitionId, Ranking, Position, RankingMatches FROM Rankings WHERE PlayerId=${params.id}`;
    [player, matches, goals, assists, results, rankings] = await Promise.all([player, matches, goals, assists, results, rankings]);
    let appearances = prisma.appearances.findMany({
        where: {
            matchid: {
                in: matches.map(match => match.pk)
            }
        }
    });
    results.map(r => {
        let ranking = rankings.filter(ranking => ranking.competitionid == r.competitionid)[0];
        if (ranking) {
            r.rankingposition = ranking.position;
            r.ranking = ranking.ranking;
        }
    })
    appearances = await appearances;

    let rows = matches.map((match, index) => ({ id: index, position: index + 1, ...match, details: getPlayerMatchDetailsElement(`${goals.filter(g => g.matchid == match.pk).length}|${assists.filter(g => g.matchid == match.pk).length}|${match.cs ? '1' : '0'}`.split('|')),reds: getFullTeamElement(appearances, match.pk, 1), blues: getFullTeamElement(appearances, match.pk, 2), pk: getMatchLinkElement(match.pk), specialStyling : `${match.result}-row`, ddate : getDateElement(match.ddate)}));
    let resultsRows = results.map((result, index) => {if(result.type == 'ranking') result.position = result.rankingposition - 1; return ({ id: index, ...result, name: (<Link href={`/competitions/${result.competitionid}`}>{result.type.toUpperCase()} {result.name} [{result.edition}]</Link>), specialStyling: `${result.ended && result.type=='liga' || result.type=='ranking' ? `position-${result.position}-row` : ''}`})});
    
    // let columns = [{ field: 'reds', headerName: "", flex: 1, renderCell: (params) => (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>{appearances.filter(appearance => appearance.matchid == params.row.pk && appearance.team == 1).map(appearance => (<p key={appearance.pk} className='player-match-competition'> {appearance.playerid ? (<Link href={`/players/${appearance.playerid}`}>{appearance.playername}</Link>) : appearance.playername}</p>))}</div>) }, { field: 'result1', headerName: "Red", flex: 0.3 }, { field: 'result2', headerName: "Blue", flex: 0.3 }, { field: 'blues', headerName: "", flex: 1, renderCell: (params) => (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>{appearances.filter(appearance => appearance.matchid == params.row.pk && appearance.team == 2).map(appearance => (<p key={appearance.pk} className='player-match-competition'>{appearance.playerid ? (<Link href={`/players/${appearance.playerid}`}>{appearance.playername}</Link>) : appearance.playername}</p>))}</div>) }, {
    //     field: 'details', headerName: "Details", flex: 0.5, valueGetter: (params) => `${goals.filter(g => g.matchid == params.row.pk).length}|${assists.filter(g => g.matchid == params.row.pk).length}|${params.row.cs ? '1' : '0'}`
    //     , renderCell: params => {
    //         let things = []
    //         let values = params.value.split('|');
    //         let tooMany = false;
    //         if (values[0] + values[1] + values[2] > 3) tooMany = true;
    //         for (let i = 0; i < values[2]; i++) things.push(<img key={i + 1} width="30" src='/cs.png' />);
    //         for (let i = 0; i < values[0]; i++) things.push(<div key={i + 1 * 100} style={{ display: 'flex' }}><img width="30" src='/football.png' /></div>);
    //         for (let i = 0; i < values[1]; i++) things.push(<img key={i + 1 * 1000} width="30" src='/assistance.png' />);
    //         return <div className="icons-row">{things}</div>
    //     }
    // }, { field: 'ddate', headerName: "Date", flex: 1 }];
    // columns.push({ field: 'pk', headerName: "", flex: 0.3, renderCell: (params) => (<Link href={`/matches/${encodeURIComponent(params.row.pk)}`}>Details</Link>) });
    // // columns.push({ field: 'pk2', headerName: "Download", flex: 0.3, renderCell: (params) => (<Link href={`/recordings/${params.row.pk}.hbr2`}><i className="bi bi-file-earmark-arrow-down"></i></Link>) });
    // let resultsColumns = [{ field: 'name', headerName: "Name", flex: 1, valueGetter: (params) => `${params.row.type.toUpperCase()} ${params.row.name} [${params.row.edition}]`, renderCell: params => (<Link href={`/competitions/${params.row.competitionid}`}>{params.value}</Link>) }, { field: 'appearances', headerName: "Apps (GK)", flex: 0.4, valueGetter: (params) => `${params.row.appearances} (${params.row.gka})` }, { field: 'goals', headerName: "Goals", flex: 0.3 }, { field: 'assists', headerName: "Assists", flex: 0.3 }, { field: 'cleansheets', headerName: "CS", flex: 0.3, hide: true }, { field: 'winrate', headerName: "%W", flex: 0.3 }, { field: 'cspercent', headerName: "%CS", flex: 0.3 }, { field: 'position', headerName: "Position", valueGetter: (params) => { if (params.row.type == 'cup') return ''; else if (params.row.type == 'ranking') return params.row.rankingposition; else return params.row.position }, flex: 0.3 }];
    // let rankingColumns = [{ field: 'name', headerName: "Name", flex: 1, valueGetter: (params) => `${params.row.name}`, renderCell: params => (<Link href={`/competitions/${params.row.competitionid}`}>{params.value}</Link>) }, { field: 'appearances', headerName: "Apps (GK)", flex: 0.4, valueGetter: (params) => `${params.row.appearances} (${params.row.gka})` }, { field: 'goals', headerName: "Goals", flex: 0.3 }, { field: 'assists', headerName: "Assists", flex: 0.3 }, { field: 'cleansheets', headerName: "CS", flex: 0.3, hide: true }, { field: 'winrate', headerName: "%W", flex: 0.3 }, { field: 'cspercent', headerName: "%CS", flex: 0.3 }, { field: 'ranking', headerName: "ELO", flex: 0.3 }, { field: 'position', headerName: "Position", valueGetter: (params) => { if (params.row.type == 'cup') return ''; else if (params.row.type == 'ranking') return params.row.rankingposition; else return params.row.position }, flex: 0.3 }];

    let columns = [{ field: 'reds', headerName: "", flex: 1}, { field: 'result1', headerName: "Red", flex: 0.3 }, { field: 'result2', headerName: "Blue", flex: 0.3 }, { field: 'blues', headerName: "", flex: 1}, {
        field: 'details', headerName: "", flex: 0.5}, { field: 'ddate', headerName: "Date", flex: 1 }];
    columns.push({ field: 'pk', headerName: "", flex: 0.5});
    // columns.push({ field: 'pk2', headerName: "Download", flex: 0.3, renderCell: (params) => (<Link href={`/recordings/${params.row.pk}.hbr2`}><i className="bi bi-file-earmark-arrow-down"></i></Link>) });
    let resultsColumns = [{ field: 'name', headerName: "Name", flex: 1}, { field: 'appearances', headerName: "Apps (GK)", flex: 0.4}, { field: 'goals', headerName: "Goals", flex: 0.3 }, { field: 'assists', headerName: "Assists", flex: 0.3 }, { field: 'cleansheets', headerName: "CS", flex: 0.3, hide: true }, { field: 'winrate', headerName: "%W", flex: 0.3 }, { field: 'cspercent', headerName: "%CS", flex: 0.3 }, { field: 'position', headerName: "Position", flex: 0.3 }];
    let rankingColumns = [{ field: 'name', headerName: "Name", flex: 1}, { field: 'appearances', headerName: "Apps (GK)", flex: 0.4}, { field: 'goals', headerName: "Goals", flex: 0.3 }, { field: 'assists', headerName: "Assists", flex: 0.3 }, { field: 'cleansheets', headerName: "CS", flex: 0.3, hide: true }, { field: 'winrate', headerName: "%W", flex: 0.3 }, { field: 'cspercent', headerName: "%CS", flex: 0.3 }, { field: 'ranking', headerName: "ELO", flex: 0.3 }, { field: 'position', headerName: "Position", flex: 0.3 }];
    
    return (
        <div>
            <h3 style={{ textAlign: 'center' }}>{player[0].nick}</h3>
            <div className='player-container'>
                <div className='card player-results'>
                    <h3>Statystyki</h3>
                    <Tabela2 rows={resultsRows.filter(rr => rr.type == 'liga' || rr.type == 'cup')} columns={resultsColumns} pageSize={10} rowHeight={52} minWidth={'600px'} />
                </div>
                <div className='card player-ranking' style={{ justifyContent: 'center' }}>
                    <h3>Ranking</h3>
                    <Tabela2 rows={resultsRows.filter(rr => rr.type == 'ranking')} columns={rankingColumns} pageSize={10} rowHeight={52}/>
                </div>
                <div className='card player-matches' >
                    <h3>Mecze</h3>
                    <Tabela2 rows={rows} columns={columns} pageSize={5} rowHeight={52 * 2}/>
                </div>
            </div>
        </div>
    )
}
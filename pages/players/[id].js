import Link from 'next/link';
import React from 'react'
import Layout from '../../components/Layout'
import Tabela from '../../components/Tabela';
import prisma from '../../lib/prisma'


export async function getServerSideProps({ params }) {
  // params.id = parseInt(params.id);
  const player = await prisma.$queryRaw`SELECT Pk, Nick FROM Players WHERE Nick=${decodeURI(params.id)}`;
  const matches = await prisma.$queryRaw`SELECT Matches.Pk AS Pk, result1, result2, TO_CHAR(TO_TIMESTAMP(date::VARCHAR(25), 'YYYYMMDDHH24MISS') , 'DD/MM/YYYY, HH24:MI:SS') AS ddate, team, (CASE WHEN (result1>result2 AND team=1) OR (result2>result1 AND team=2) THEN 'win' WHEN result1=result2 THEN 'draw' ELSE 'loss' END) AS result, (CASE WHEN Appearances.isGk = 1 AND ((team = 1 AND result2 = 0) OR (team = 2 AND result1=0)) THEN true ELSE false END) AS cs FROM Matches LEFT JOIN Appearances ON Matches.Pk = Appearances.MatchId WHERE Appearances.PlayerId=${player[0].pk} ORDER BY date DESC`;
  const goals = await prisma.$queryRaw`SELECT MatchId FROM Goals WHERE Scorer=${player[0].pk} AND Own=0;`
  const assists = await prisma.$queryRaw`SELECT MatchId FROM Goals WHERE Assister=${player[0].pk};`
  const results = await prisma.$queryRaw`SELECT CompetitionId, Ended, SeriesId, Edition, Position, Series.Name AS Name, Series.Type AS Type, Appearances, Goals, Assists, Wins, Draws, Losses, CleanSheets, GkA FROM Stats LEFT JOIN Series ON Series.Pk = SeriesId WHERE Nick=${player[0].nick} AND Name IS NOT NULL ORDER BY Name ASC, Edition DESC;`;
  return {
    props: { player: JSON.stringify(player), matches: JSON.stringify(matches), results: JSON.stringify(results), goals: JSON.stringify(goals), assists: JSON.stringify(assists) }, // will be passed to the page component as props
  }
}




function Player({ player, matches, results, goals, assists }) {
  results = JSON.parse(results);
  player = JSON.parse(player);
  console.log(matches);
  matches = JSON.parse(matches);
  goals = JSON.parse(goals);
  console.log(goals);
  assists = JSON.parse(assists);
  let rows = matches.map((match, index) => ({ id: index, position: index + 1, ...match }));
  let resultsRows = results.map((result, index) => ({ id: index, ...result }));
  let columns = [{ field: 'result1', headerName: "Red", flex: 0.3 }, { field: 'result2', headerName: "Blue", flex: 0.3 }, { field: 'details', headerName: "Details", flex: 0.5, valueGetter: (params) => `${goals.filter(g => g.matchid == params.row.pk).length}|${assists.filter(g => g.matchid == params.row.pk).length}|${params.row.cs ? '1' : '0'}`
  , renderCell : params => {
    let things = []
    let values = params.value.split('|');
    let tooMany = false;
    if (values[0] + values[1] + values[2] > 3) tooMany = true;
    for(let i=0; i < values[2]; i++) things.push(<img width="30" src='/cs.png'/>);
    for(let i=0; i < values[0]; i++) things.push(<div style={{display:'flex'}}><img width="30" src='/football.png'/></div>);
    for(let i=0; i < values[1]; i++) things.push(<img width="30" src='/assistance.png'/>);
    return <div className="icons-row">{things}</div>
  } }, { field: 'ddate', headerName: "Date", flex: 1 }];
  columns.push({ field: 'pk', headerName: "", flex: 0.3, renderCell: (params) => (<a href={`/matches/${encodeURIComponent(params.row.pk)}`}>Details</a>) });
  columns.push({ field: 'pk2', headerName: "Download", flex: 0.3, renderCell: (params) => (<Link href={`/recordings/${params.row.pk}.hbr2`}><i className="bi bi-file-earmark-arrow-down"></i></Link>) });
  let resultsColumns = [{ field: 'name', headerName: "Name", flex: 1, valueGetter: (params) => `${params.row.type.toUpperCase()} ${params.row.name} [${params.row.edition}]`}, { field: 'appearances', headerName: "Apps (GK)", flex: 0.4, valueGetter: (params) => `${params.row.appearances} (${params.row.gka})`}, { field: 'goals', headerName: "Goals", flex: 0.3}, { field: 'assists', headerName: "Assists", flex: 0.3}, { field: 'cleansheets', headerName: "CS", flex: 0.3}, { field: 'position', headerName: "Position", valueGetter: (params) => {if(params.row.type== 'cup') return ''; else return params.row.position}, flex: 0.3}];
  return (
    <div>
      <h3 style={{textAlign:'center'}}>{player[0].nick}</h3>
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div className='card'>
        <h3>Results</h3>
        <div style={{ minWidth: '600px' }}>
      <Tabela rows={resultsRows} columns={resultsColumns} pageSize={10} rowHeight={52} getRowClassName={(params) => params.row.ended ? `position-${params.row.position}-row` : null} />
      </div>
      </div>
      <div className='card' style={{ justifyContent: 'center' }}>
        <h3>Matches</h3>
        <div style={{ minWidth: '600px' }}>
          <Tabela rows={rows} columns={columns} pageSize={10} rowHeight={52} getRowClassName={(params) => `${params.row.result}-row`} />
        </div>
      </div>
    </div>
    </div>
  )
}

export default Player
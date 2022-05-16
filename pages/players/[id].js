import Link from 'next/link';
import React from 'react'
import Layout from '../../components/Layout'
import Tabela from '../../components/Tabela';
import prisma from '../../lib/prisma'


export async function getServerSideProps({ params }) {
    // params.id = parseInt(params.id);
    const player = await prisma.$queryRaw`SELECT Pk, Nick FROM Players WHERE Nick=${decodeURI(params.id)}`;
    const matches = await prisma.$queryRaw`SELECT Pk AS Pk, result1, result2, TO_CHAR(TO_TIMESTAMP(date::VARCHAR(25), 'YYYYMMDDHH24MISS') , 'DD/MM/YYYY, HH24:MI:SS') AS ddate FROM Matches WHERE Matches.Pk IN (SELECT MatchId FROM Appearances WHERE PlayerId=${player[0].pk}) ORDER BY date DESC`;
    return {
        props: {player: JSON.stringify(player), matches: JSON.stringify(matches) }, // will be passed to the page component as props
    }
}




function Player({player, matches}) {
  player = JSON.parse(player);
  console.log(matches);
  matches = JSON.parse(matches);
  let rows = matches.map((match, index) => ({ id: index, position: index + 1, ...match}));
  console.log(rows);
  let columns = [{field: 'result1', headerName: "Red", flex: 0.3 },{ field: 'result2', headerName: "Blue", flex: 0.3 },{ field: 'ddate', headerName: "Date", flex: 1 }];
  columns.push({field: 'pk', headerName: "", flex: 0.3, renderCell: (params) => (<a href={`/matches/${encodeURIComponent(params.row.pk)}`}>Details</a>)});
  columns.push({field: 'pk2', headerName: "Download", flex: 0.3, renderCell: (params) => (<Link href={`/recordings/${params.row.pk}.hbr2`}><i className="bi bi-file-earmark-arrow-down"></i></Link>)});  
  return (
    <div className='card' style={{justifyContent:'center'}}>
      <h3>Matches</h3>
      <div style={{minWidth: '500px'}}>
      <Tabela rows = {rows} columns = {columns} pageSize={10} rowHeight={52}/>
      </div>
    </div>
  )
}

export default Player
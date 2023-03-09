import React from 'react'
import prisma from '../../lib/prisma'
import Tabela from '../../components/Tabela'
import Tabela2 from '../../components/Tabela2'
import Link from 'next/link';
import getLink from '../../lib/utilities'

export async function getStaticProps({ params }) {
    const players = await prisma.$queryRaw`SELECT Pk AS Id, Nick, Role, TO_CHAR(TO_TIMESTAMP(RegisteredOn::VARCHAR(25), 'YYYYMMDDHH24MISS'), 'DD/MM/YYYY, HH24:MI:SS') AS RegisteredOn FROM Players ORDER BY Pk ASC`;
    return {
        props: {players: JSON.stringify(players) },        
        revalidate: 300
    }
}

export default function Players({players}) {
    players = JSON.parse(players);
    let rows = players.map((row, index) => ({ id: index, position: index + 1, ...row }));
    let columns = Object.keys(players[0]).map((columnName) => {
        if (columnName != "nick") return ({ field: columnName, headerName: columnName.toUpperCase(), flex: 1 });
        else return ({ field: columnName, headerName: columnName.toUpperCase(), flex: 1, renderCell: (params) => (getLink(params.row.nick, params.row.id)) });
    }
    );
  return (
    <div className='card'>
        <h3>Zawodnicy</h3>
        <Tabela2 rows={rows} columns={columns} pageSize={10}/>
    </div>
  )
}

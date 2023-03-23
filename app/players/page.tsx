//@ts-nocheck
import React from 'react'
import prisma from '../../lib/prisma'
import Tabela from '../../components/Tabela'
import Link from 'next/link';
import {getLink} from '../../lib/utilities'

export const revalidate = 60;

export default async function Players(props) {
    const players = await prisma.$queryRaw`SELECT Pk AS Id, Nick, Role, TO_CHAR(TO_TIMESTAMP(RegisteredOn::VARCHAR(25), 'YYYYMMDDHH24MISS'), 'DD/MM/YYYY, HH24:MI:SS') AS RegisteredOn FROM Players ORDER BY Pk ASC`;
    let rows = players.map((row, index) => ({ id: index, position: index + 1, ...row, nick: getLink(row.nick, row.id) }));
    let columns = Object.keys(players[0]).map((columnName) => {
        if (columnName != "nick") return ({ field: columnName, headerName: columnName.toUpperCase(), flex: 1 });
        else return ({ field: columnName, headerName: columnName.toUpperCase(), flex: 1 });
    }
    );
  return (
    <div className='card'>
        <h3>Zawodnicy</h3>
        <Tabela rows={rows} columns={columns} pageSize={10} minWidth={'550px'}/>
    </div>
  )
}

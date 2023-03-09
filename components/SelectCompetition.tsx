//@ts-nocheck
"use client";
import React from 'react'
import {useRouter} from 'next/navigation';

export default function SelectCompetition(props) {
    const router = useRouter();
  return (
    <select className='selectEdition' defaultValue={props.defaultValue} onChange={(e) => {
        var cid = JSON.stringify(props.editions.filter(edition => edition.edition == e.target.value)[0].pk);
        router.push(`/competitions/${cid}`)
    }}>
        {props.editions.map(edition => (<option key={edition.pk} value={edition.edition}>{edition.edition}</option>))};
    </select>
  )
}

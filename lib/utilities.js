import Link from "next/link";

export default function getLink (playerName, playerId) { 
    if(playerId) return <Link className='player-link' href={`/players/${playerId}`}>{playerName}</Link>;
    else return (playerName);
  }

 
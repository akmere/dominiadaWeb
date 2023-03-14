import Link from "next/link";
import Image from "next/image";

function replaceCharacter(string, index, replacement) {
  return (
    string.slice(0, index) +
    replacement +
    string.slice(index + replacement.length)
  );
}

export function getLink(playerName, playerId) {
  if (playerId) return <Link className='player-link' href={`/players/${playerId}`}>{playerName}</Link>;
  else return (playerName);
}

export function getMatchLinkElement(matchId, text = 'Watch') {
  return (<Link href={`/matches/${encodeURIComponent(matchId)}`}>{text}</Link>)
}

export function getTeamElement(teamAppearances) {
  return (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>{teamAppearances.map((teamAppearance, index) => (<p key={index} className='player-match-competition'> {teamAppearance.playerid ? (<Link href={`/players/${teamAppearance.playerid}`}>{teamAppearance.playername}</Link>) : teamAppearance.playername}</p>))}</div>)
}

export function getTeamAppearances(appearances, matchId) {
  let matchAppearances = appearances.filter(appearance => appearance.matchid == matchId);
  let redAppearances = matchAppearances.filter(appearance => appearance.team == 1);
  let blueAppearances = matchAppearances.filter(appearance => appearance.team == 2);
  return [redAppearances, blueAppearances];
}

export function getFullTeamElement(appearances, matchId, team) {
  let matchAppearances = appearances.filter(appearance => appearance.matchid == matchId && appearance.team == team);
  return getTeamElement(matchAppearances);
}

export function getPlayerMatchDetailsElement(values) {
  let things = [];
  let tooMany = false;
  if (values[0] + values[1] + values[2] > 3) tooMany = true;
  for (let i = 0; i < values[2]; i++) things.push(<Image alt='cs' key={i + 1} width="30" height="30" src='/cs.png' />);
  for (let i = 0; i < values[0]; i++) things.push(<div key={i + 1 * 100} style={{ display: 'flex' }}><Image alt='ball' width="30" height="30" src='/football.png' /></div>);
  for (let i = 0; i < values[1]; i++) things.push(<Image alt='assist' key={i + 1 * 1000} width="30" height="30" src='/assistance.png' />);
  return <div className="icons-row">{things}</div>
}

export function getDateElement(date) {
  try {
    let newDate = date;
    newDate = replaceCharacter(date, 0, date[3]);
    newDate = replaceCharacter(newDate, 1, date[4]);
    newDate = replaceCharacter(newDate, 3, date[0]);
    newDate = replaceCharacter(newDate, 4, date[1]);
    let bob = new Date(newDate);
    return (<div style={{ textAlign: 'center' }}><p>{bob.getFullYear()}/{(bob.getMonth() + 1).toString().padStart(2, '0')}/{bob.getDate().toString().padStart(2, '0')}</p><p>{bob.getHours().toString().padStart(2, '0')}:{bob.getMinutes().toString().padStart(2, '0')}:{bob.getSeconds().toString().padStart(2, '0')}</p></div>)
  }
  catch (e) {
    return '';
  }
}
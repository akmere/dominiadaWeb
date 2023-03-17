import React from 'react'
import fs from 'fs';

export const revalidate = 600;

export default function faq({params, searchParams}) {
  const commandsPath = `public/commands.json`;
  var commandsData = fs.readFileSync(commandsPath, 'utf8');
  let commands = JSON.parse(commandsData);
  const questionsPath = `public/questions.json`;
  var questionsData = fs.readFileSync(questionsPath, 'utf8');
  let questions = JSON.parse(questionsData);
  const roles = [... new Set(commands.map(command => command.role))];
  return (
    <div className='faq-container'>
      <div className='card faq-container-item'>
        <h1>FAQ</h1>
        <ul className='commands-list'>
          {questions.map(question => (
          <li key={question.question}>
            <p style={{fontWeight: 'bold'}}>{question.question}</p>
            <p>{question.answer}</p>
          </li>))}
          </ul>
      </div>
      <div className='card faq-container-item'>
        <h1>Komendy</h1>
        {roles.map(role => (
        <div key={role}>
          <h2 style={{textAlign: 'center'}}>{role}</h2>
          <ul className='commands-list'>
          {commands.filter(command => command.role == role).map(command => (
          <li key={command.name}>
            <p style={{fontWeight: 'bold'}}>{command.name}</p>
            <p>{command.definition}</p>
          </li>))}
        </ul>
        </div>))}
        
      </div>
    </div>
  )
}

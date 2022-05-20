import React from 'react'
import fs from 'fs';

export async function getServerSideProps(context) {
  const commandsPath = `public/commands.json`;
  var commandsData = fs.readFileSync(commandsPath, 'utf8');
  var commandsJson = JSON.parse(commandsData);
  const questionsPath = `public/questions.json`;
  var questionsData = fs.readFileSync(questionsPath, 'utf8');
  var questionsJson = JSON.parse(questionsData);
  return {
    props: {commands: commandsJson, questions: questionsJson}, // will be passed to the page component as props
  }
}

export default function faq({commands, questions}) {
  const roles = [... new Set(commands.map(command => command.role))];
  return (
    <div className='faq-container'>
      <div className='card faq-container-item'>
        <h1>FAQ</h1>
        <ul className='commands-list'>
          {questions.map(question => (
          <li>
            <p style={{fontWeight: 'bold'}}>{question.question}</p>
            <p>{question.answer}</p>
          </li>))}
          </ul>
      </div>
      <div className='card faq-container-item'>
        <h1>Komendy</h1>
        {roles.map(role => (
        <div>
          <h2 style={{textAlign: 'center'}}>{role}</h2>
          <ul className='commands-list'>
          {commands.filter(command => command.role == role).map(command => (
          <li>
            <p style={{fontWeight: 'bold'}}>{command.name}</p>
            <p>{command.definition}</p>
          </li>))}
        </ul>
        </div>))}
        
      </div>
    </div>
  )
}

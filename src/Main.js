import React from 'react';
import Routes from './Routes'
import { Link } from 'react-router-dom'

const list = [
  'boids',
  'dejong',
  'pendulum',
]

export default () => {

  return <div className="App">
    <header>
      <h1>JujiPlay };</h1>
      <p>
        I'm playing with codes<br />
        <small>Mostly useless stuff...</small><br />
      </p>
    </header>
    <div className="menu">
      <div className="menu-container">
        {list.map(v => <Link to={`/${v}`}><img src={`/img/${v}.png`} /></Link>)}
      </div>
    </div>
    <Routes />
  </div>

}

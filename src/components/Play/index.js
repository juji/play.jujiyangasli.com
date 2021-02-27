import React, {useMemo} from 'react'
import { Link } from 'react-router-dom'
import Pendulum from './modules/Pendulum'
import Dejong from './modules/Dejong'
import Boids from './modules/Boids'

const data = {
  pendulum: Pendulum,
  dejong: Dejong,
  boids: Boids,
}

export default props => {

  const { match } = props;
  if(!match || !match.params  || !match.params.id) return <div className="play"></div>

  const Module = useMemo(
    () => data[match.params.id],
    [match.params.id]
  )

  if(!Module) return <div className="play"></div>

  return <div className="play full">
    <div className="play-container">
      <Link to="/" className="back">&times;</Link>
      {/* <a href="/" className="back">&times;</a> */}
      <Module />
    </div>
  </div>
}

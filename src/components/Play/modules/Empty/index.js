import React, {useRef, useEffect} from 'react'
import Thing from './thing'

export default p => {

  const canvas = useRef()
  const thing = useRef();

  useEffect(() => {
    if(thing.current && thing.current.stop) thing.current.stop();
    if(!canvas.current) return;
    thing.current = new Thing(canvas.current)

    return () => thing.current && thing.current.stop && thing.current.stop();
  },[])

  const click = () => {
    thing.current && thing.current.init && thing.current.init();
  }

  return <canvas onClick={click} ref={canvas}></canvas>


}

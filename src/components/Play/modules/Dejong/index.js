import React, {useRef, useEffect} from 'react'
import Dejong from './dejong'

export default p => {

  const canvas = useRef()
  const dejong = useRef();

  useEffect(() => {
    if(dejong.current && dejong.current.stop) dejong.current.stop();
    if(!canvas.current) return;
    dejong.current = new Dejong(canvas.current)
    return () => {
      dejong.current && dejong.current.stop && dejong.current.stop();
    }
  },[])

  const click = () => {
    if(dejong.current && dejong.current.init)
      dejong.current.init();
  }

  return <canvas onClick={click} ref={canvas}></canvas>


}

import React, {useRef, useEffect} from 'react'
import Pendulum from './doublePendulum'

export default p => {

  const canvas = useRef()
  const pendulum = useRef();

  useEffect(() => {
    if(pendulum.current && pendulum.current.stop) pendulum.current.stop();
    if(!canvas.current) return;
    pendulum.current = Pendulum(canvas.current, uri => {
      console.log(uri)
    })

    return () => {
      pendulum.current && pendulum.current.stop && pendulum.current.stop();
    }
  },[])

  const click = () => {
    if(pendulum.current && pendulum.current.init)
      pendulum.current.init();
  }

  return <>
    <canvas onClick={click} ref={canvas}></canvas>
    <div style={{
      position:'absolute',top:'21px',left:'21px',width:'55px',height:'55px',border: '1px solid #383838'
    }}></div>
  </>



}

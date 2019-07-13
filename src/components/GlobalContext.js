import React, { useContext, useEffect, useState } from 'react'

const initial = {
  pointer: {x: null, y: null},
  touches: []
};

const GlobalContext = React.createContext(initial);
const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {

  const [ context, setContext ] = useState({ ...initial });

  useEffect(() => {

    const onTouch = (e) => {

    }

    // handle touch event
    document.addEventListener('touchstart', onFirstTouch);

  },[])

  return (
    <GlobalContext.Provider value={context}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider, useGlobalContext }

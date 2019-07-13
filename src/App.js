import React from 'react';

import { BrowserRouter as Router, Route } from "react-router-dom";
// import { GlobalProvider } from './components/GlobalContext'

import Main from './Main'

function App() {
  return <Router>
    <Route component={Main} />
  </Router>
}

export default App;

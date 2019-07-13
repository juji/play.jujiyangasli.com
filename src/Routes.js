import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Play from './components/Play'

export const sitemap = (
  <Switch>
    <Route path="/:id" component={Play} />
    <Route component={Play} />
  </Switch>
)

export default p => sitemap

/** @format */

import React from 'react';
import { Router } from 'react-chrome-extension-router';
import Login from './Login';

const AppRouter = () => {
  return (
    <Router>
      <Login />
    </Router>
  );
};

export default AppRouter;

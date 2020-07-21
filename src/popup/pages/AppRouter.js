/** @format */

import React, { useState, useEffect } from 'react';
import { Router } from 'react-chrome-extension-router';
import Login from './Login';
import Main from './Main';

const AppRouter = () => {
  // dummy log in status
  // true -> direct user to popup
  // false -> have user log in
  const [loggedIn, setLoggedIn] = useState(true);
  return <Router>{loggedIn ? <Main /> : <Login />}</Router>;
};

export default AppRouter;

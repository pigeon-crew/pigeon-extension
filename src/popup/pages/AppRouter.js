/** @format */

import React, { useState, useEffect } from 'react';
import { Router } from 'react-chrome-extension-router';
import Login from './Login';
import Popup from './Popup';

const AppRouter = () => {
  // dummy log in status
  // true -> direct user to popup
  // false -> have user log in
  const [loggedIn, setLoggedIn] = useState(false);
  return <Router>{loggedIn ? <Popup /> : <Login />}</Router>;
};

export default AppRouter;

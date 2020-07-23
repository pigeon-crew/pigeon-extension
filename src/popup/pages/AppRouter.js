/** @format */

import React, { useState, useEffect } from 'react';
import { Router } from 'react-chrome-extension-router';
import Login from './Login';
import Main from './Main';

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.message === 'hi') sendResponse({ message: 'hi to you' });
// });

const AppRouter = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  chrome.runtime.sendMessage({ type: 'popupInit' }, (response) => {
    if (response && response.success) {
      setLoggedIn(true);
    }
  });

  return (
    <Router>{loggedIn ? <Main /> : <Login setLoggedIn={setLoggedIn} />}</Router>
  );
};

export default AppRouter;

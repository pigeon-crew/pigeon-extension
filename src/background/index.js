/** @format */
import axios from 'axios';
import { API_ENDPOINT } from '../common/config';

console.log('Background.js file loaded');

// TODO
/* const defaultUninstallURL = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://wwww.github.com/kryptokinght'
    : '';
}; */

function login({ email, password }, callback) {
  axios({
    url: `${API_ENDPOINT}/api/users/login`,
    method: 'POST',
    timeout: 0,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ email: email, password: password }),
  })
    .then((res) => {
      const { refreshToken, accessToken } = res.data;
      console.log(refreshToken);
      callback({ refreshToken, accessToken });
    })
    .catch((err) => {
      callback({ error: err.response });
    });
}

function setRefreshToken(refreshToken, callback) {
  chrome.storage.local.set({ refreshToken }, () => {
    callback({ success: true });
  });
}

function setAccessToken(accessToken, callback) {
  chrome.storage.local.set({ accessToken }, () => {
    callback({ success: true });
  });
}

function getToken(callback) {
  chrome.storage.local.get('refreshToken', (tokenPair) => {
    callback({ success: true, refreshToken: tokenPair['refreshToken'] });
  });
}

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.type) {
    case 'popupInit':
      getToken((res) => {
        if (res && res.refreshToken) {
          response({ success: true });
        }
        response({ success: false });
      });
      break;
    case 'login':
      login(msg.payload, (res) => {
        if (res.error) {
          response({ success: false, error: res.error.data });
        }

        const { refreshToken, accessToken } = res;
        // storing tokens
        setRefreshToken(refreshToken, (res1) => {
          setAccessToken(accessToken, (res2) => {
            if (res1 && res1.success && res2 && res2.success) {
              response({ success: true });
            }
            response({ success: false });
          });
        });
      });
      break;
    default:
      response('unknown request');
      break;
  }
  return true;
});

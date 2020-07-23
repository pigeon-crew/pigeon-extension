/** @format */
import axios from 'axios';
import { API_ENDPOINT, ACCESS_TOKEN } from '../services/config';

// TODO
/* const defaultUninstallURL = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://wwww.github.com/kryptokinght'
    : '';
}; */

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

function getRefreshToken() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('refreshToken', (tokenPair) => {
      const refreshToken = tokenPair['refreshToken'];

      if (refreshToken) {
        resolve(refreshToken);
      } else {
        reject(new Error('Token not found'));
      }
    });
  });
}

function login(email, password) {
  return new Promise((resolve, reject) => {
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
        resolve({ refreshToken, accessToken });
      })
      .catch((err) => reject(err));
  });
}

function fetchMyFeed() {
  return new Promise((resolve, reject) => {
    axios({
      url: `${API_ENDPOINT}/api/links/me`,
      method: 'GET',
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
      .then((res) => {
        const links = res.data.links;
        resolve(links);
      })
      .catch((err) => reject(err));
  });
}

function sendLink(linkUrl, recipientEmail) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${API_ENDPOINT}/api/links/create`,
      method: 'POST',
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        linkUrl,
        recipientEmail,
      }),
    })
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

function fetchCurrentFriend() {
  return new Promise((resolve, reject) => {
    axios({
      url: `${API_ENDPOINT}/api/friends/current`,
      method: 'GET',
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
      .then((res) => {
        const friends = res.data.data;
        resolve(friends);
      })
      .catch((err) => reject(err));
  });
}

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.type) {
    case 'popupInit':
      getRefreshToken()
        .then((token) => {
          response({ success: true });
        })
        .catch((err) => {
          response({ success: false });
        });

      break;
    case 'login':
      const { email, password } = msg.payload;
      login(email, password)
        .then((data) => {
          const { refreshToken, accessToken } = data;

          setRefreshToken(refreshToken, (res1) => {
            setAccessToken(accessToken, (res2) => {
              if (res1 && res1.success && res2 && res2.success) {
                response({ success: true });
              }
              response({ success: false });
            });
          });
        })
        .catch((err) => {
          response({ success: false, error: err });
        });
      break;
    case 'fetchMyFeed':
      console.log('Fetch feed is called');
      fetchMyFeed()
        .then((data) => {
          response({ success: true, links: data });
        })
        .catch((err) => {
          response({ success: false, error: err });
        });
      break;
    case 'fetchCurrentFriend':
      console.log('Fetch friend is called');
      fetchCurrentFriend()
        .then((data) => {
          response({ success: true, friend: data });
        })
        .catch((err) => {
          response({ success: false, error: err });
        });
      break;
    case 'sendLink':
      console.log('Send link is called');
      const { linkUrl, recipientEmail } = msg.payload;
      sendLink(linkUrl, recipientEmail)
        .then(() => {
          response({ success: true });
        })
        .catch((err) => {
          response({ success: false, error: err });
        });
      break;
    default:
      response('unknown request');
      break;
  }
  return true;
});

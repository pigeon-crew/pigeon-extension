/** @format */
import axios from 'axios';
// access token no longer exists! todo!
import { API_ENDPOINT } from '../services/config';

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

function fetchMyFeed(ACCESS_TOKEN) {
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

function sendLink(linkUrl, recipientEmail, ACCESS_TOKEN) {
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

function fetchCurrentFriend(ACCESS_TOKEN) {
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

function fetchPendingFriend(ACCESS_TOKEN) {
  console.log(ACCESS_TOKEN);
  return new Promise((resolve, reject) => {
    axios({
      url: `${API_ENDPOINT}/api/friends/pending`,
      method: 'GET',
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
      .then((res) => {
        const requests = res.data.data;
        resolve(requests);
      })
      .catch((err) => {
        console.log(err.response);
        reject(err);
      });
  });
}

export { login, fetchCurrentFriend, fetchMyFeed, sendLink, fetchPendingFriend };

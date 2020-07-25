/** @format */

import {
  login,
  fetchCurrentFriend,
  fetchMyFeed,
  sendLink,
  fetchPendingFriend,
  acceptRequest,
  rejectRequest,
  fetchMe,
  sendFriendRequest,
} from '../services/apiClient';
import {
  setTokens,
  getRefreshToken,
  getAccessToken,
  setNotifyCount,
  getNotifyCount,
} from '../services/storageClient';
import { API_ENDPOINT } from '../services/config';

import io from 'socket.io-client';

let socket = io.connect(API_ENDPOINT);
let uid = null;

socket.on('notifiyNewLink', (payload) => {
  getNotifyCount((count) => {
    console.log(count);
    const newCount = count + 1 || 1;
    console.log(newCount);
    setNotifyCount(newCount, () => {
      console.log(newCount);
      if (newCount > 9) {
        chrome.browserAction.setBadgeText({ text: '10+' });
      } else {
        chrome.browserAction.setBadgeText({ text: String(newCount) });
      }
      chrome.notifications.create('', {
        title: payload.title,
        message: payload.message,
        iconUrl: 'img/icons/icon@128.png',
        type: 'basic',
      });
    });
  });
});

function bindSocketToUID() {
  getAccessToken()
    .then((token) => {
      fetchMe(token).then((user) => {
        socket.emit('bindUID', user);
        uid = user._id;
      });
    })
    .catch(() => {
      console.error('Failed to bind user id with socket');
    });
}

function unbindSocketToUID() {
  if (uid) {
    socket.emit('unbindUID');
  }
}

function emitLinkSent(recipientEmail) {
  if (uid) {
    const payload = { senderId: uid, recipientEmail };
    socket.emit('linkSent', payload);
  }
}

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.type) {
    case 'popupInit':
      getRefreshToken()
        .then(() => {
          bindSocketToUID();
          // clear notification
          setNotifyCount(0, () => {
            chrome.browserAction.setBadgeText({ text: '' });
            response({ success: true });
          });
        })
        .catch((err) => {
          response({ success: false });
        });
      break;
    case 'login':
      const { email, password } = msg.payload;
      login(email, password)
        .then((data) => {
          const { accessToken, refreshToken } = data;
          setTokens(accessToken, refreshToken)
            .then(() => response({ success: true }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case 'logout':
      setTokens('', '')
        .then(() => {
          unbindSocketToUID();
          response({ success: true });
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case 'fetchMyFeed':
      getAccessToken()
        .then((token) => {
          fetchMyFeed(token)
            .then((data) => response({ success: true, links: data }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case 'fetchCurrentFriend':
      getAccessToken()
        .then((token) => {
          fetchCurrentFriend(token)
            .then((data) => response({ success: true, friend: data }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case 'sendLink':
      getAccessToken()
        .then((token) => {
          const { linkUrl, recipientEmail } = msg.payload;
          sendLink(linkUrl, recipientEmail, token)
            .then(() => {
              emitLinkSent(recipientEmail);
              response({ success: true });
            })
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case 'fetchPendingFriends':
      getAccessToken()
        .then((token) => {
          fetchPendingFriend(token)
            .then((data) => response({ success: true, request: data }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case 'acceptRequest':
      getAccessToken()
        .then((token) => {
          const { friendReqId } = msg.payload;
          acceptRequest(friendReqId, token)
            .then(() => response({ success: true }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case 'rejectRequest':
      getAccessToken()
        .then((token) => {
          const { friendReqId } = msg.payload;
          rejectRequest(friendReqId, token)
            .then(() => response({ success: true }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case 'sendFriendRequest':
      getAccessToken()
        .then((token) => {
          const { email } = msg.payload;
          sendFriendRequest(email, token)
            .then(() => response({ success: true }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    default:
      response({ success: false, error: 'Unknown request' });
      break;
  }
  return true;
});

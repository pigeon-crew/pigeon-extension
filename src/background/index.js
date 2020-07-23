/** @format */

import {
  login,
  fetchCurrentFriend,
  fetchMyFeed,
  sendLink,
  fetchPendingFriend,
  acceptRequest,
  rejectRequest,
} from '../services/apiClient';

import {
  setTokens,
  getRefreshToken,
  getAccessToken,
} from '../services/storageClient';

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
          const { accessToken, refreshToken } = data;
          setTokens(accessToken, refreshToken)
            .then(() => response({ success: true }))
            .catch((err) => response({ success: false, error: err }));
        })
        .catch((err) => response({ success: false, error: err }));
      break;
    case 'logout':
      setTokens('', '')
        .then(() => response({ success: true }))
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
            .then(() => response({ success: true }))
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
    default:
      response({ success: false, error: 'Unknown request' });
      break;
  }
  return true;
});

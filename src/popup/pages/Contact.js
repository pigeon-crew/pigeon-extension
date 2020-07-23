/** @format */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { goBack } from 'react-chrome-extension-router';

import { ADD_FRIEND_URL } from '../../services/config';

import FriendReqItem from '../components/FriendReqItem';

const ContactContainer = styled.div`
  text-align: left;
  width: 310px;
  height: 400px;
  overflow: scroll;
`;

const Contact = () => {
  const [pendingRequests, setPendingRequests] = useState([]);

  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
  };

  const fetchPendingRequests = () => {
    chrome.runtime.sendMessage({ type: 'fetchPendingFriends' }, (response) => {
      if (response && response.success) {
        setPendingRequests(response.request);
        return;
      }
      alert('Fetch Pending Request Error');
    });
  };

  const handleAccept = (friendReqId) => {
    const payload = { friendReqId };

    chrome.runtime.sendMessage(
      { type: 'acceptRequest', payload },
      (response) => {
        if (response && response.success) {
          fetchPendingRequests();
          return;
        }
        alert('Accept Request Error');
      }
    );
  };

  const handleReject = (friendReqId) => {
    const payload = { friendReqId };

    chrome.runtime.sendMessage(
      { type: 'rejectRequest', payload },
      (response) => {
        if (response && response.success) {
          fetchPendingRequests();
          return;
        }
        alert('Reject Request Error');
      }
    );
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <ContactContainer>
      <h1>Pending Requests</h1>
      <button onClick={() => openURL(ADD_FRIEND_URL)}>Add Friends</button>
      <button onClick={() => goBack()}>Back</button>

      {pendingRequests && pendingRequests.length > 0 ? (
        pendingRequests.map((data) => {
          return (
            <FriendReqItem
              key={data._id}
              data={data}
              handleAccept={handleAccept}
              handleReject={handleReject}
            />
          );
        })
      ) : (
        <div>Your have no pending requests</div>
      )}
    </ContactContainer>
  );
};

export default Contact;

/** @format */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { goBack } from 'react-chrome-extension-router';

import axios from 'axios';
import { API_ENDPOINT, ADD_FRIEND_URL } from '../../services/config';

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

  const handleAccept = (id) => {
    console.log(id);
    axios({
      url: `${API_ENDPOINT}/api/friends/accept`,
      method: 'POST',
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ friendReqId: id }),
    })
      .then(() => {
        fetchPendingRequests();
      })
      .catch((err) => {
        console.error(err.response);
      });
  };

  const handleReject = (id) => {
    axios({
      url: `${API_ENDPOINT}/api/friends/reject`,
      method: 'POST',
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ friendReqId: id }),
    })
      .then(() => {
        fetchPendingRequests();
      })
      .catch((err) => {
        console.error(err.response);
      });
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

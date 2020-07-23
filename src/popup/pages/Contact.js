/** @format */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { goBack } from 'react-chrome-extension-router';

import axios from 'axios';
import { API_ENDPOINT, ACCESS_TOKEN } from '../../common/config';

import FriendReqItem from '../components/FriendReqItem';

const ContactContainer = styled.div`
  text-align: left;
  width: 310px;
  height: 400px;
  overflow: scroll;
`;

const Contact = () => {
  const [pendingRequests, setPendingRequests] = useState([]);

  const pigeonSite = 'https://pigeon-webapp.herokuapp.com/';
  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
  };

  const fetchPendingRequests = () => {
    axios({
      url: `${API_ENDPOINT}/api/friends/pending`,
      method: 'POST',
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }).then((res) => {
      const requests = res.data.data;
      setPendingRequests(requests);
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
    console.log(id);
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
      <button onClick={() => openURL(pigeonSite)}>Add Friends</button>
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

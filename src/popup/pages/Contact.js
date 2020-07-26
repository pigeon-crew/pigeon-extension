/** @format */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { goBack } from 'react-chrome-extension-router';
import FriendReqItem from '../components/FriendReqItem';

const ContactContainer = styled.div`
  text-align: left;
  width: 310px;
  height: 400px;
  overflow: scroll;
`;

const validateEmail = (email) => {
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegexp.test(email);
};

const Contact = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [email, setEmail] = useState('');

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

  const handleSendRequest = () => {
    if (!validateEmail(email)) return;

    const payload = { email };
    chrome.runtime.sendMessage(
      { type: 'sendFriendRequest', payload },
      (response) => {
        if (response && response.success) {
          alert('Friend request sent!');
          return;
        }
        alert('Friend Request Error');
      }
    );
  };

  const handleEmailChanged = (e) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <ContactContainer>
      <h1>Manage Contact</h1>
      <button onClick={() => goBack()}>Back</button>
      <h3>Add Friends</h3>
      <input
        placeholder="Email"
        value={email}
        onChange={handleEmailChanged}
      ></input>
      <button onClick={handleSendRequest}>Send Request</button>
      <h3>Pending Requests</h3>
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

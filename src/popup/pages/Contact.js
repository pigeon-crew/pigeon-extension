/** @format */
import React from 'react';
import styled from 'styled-components';
import { goBack } from 'react-chrome-extension-router';

const ContactContainer = styled.div`
  text-align: left;
  width: 310px;
  height: 400px;
  overflow: scroll;
`;

const pendingRequests = [
  { id: '1', requesterName: 'John Smith' },
  { id: '2', requesterName: 'Mary Smith' },
];

const Contact = () => {
  const pigeonSite = 'https://pigeon-webapp.herokuapp.com/';
  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
  };

  return (
    <ContactContainer>
      <h1>Pending Requests</h1>
      <button onClick={() => openURL(pigeonSite)}>Add Friends</button>
      <button onClick={() => goBack()}>Back</button>

      {pendingRequests && pendingRequests.length > 0 ? (
        pendingRequests.map((val) => {
          return (
            <div>
              <h3>{val.requesterName}</h3>
              <button>Accept</button>
              <button>Reject</button>
            </div>
          );
        })
      ) : (
        <div>Your have no pending requests</div>
      )}
    </ContactContainer>
  );
};

export default Contact;

/** @format */
import React from 'react';
import styled from 'styled-components';
import { goBack } from 'react-chrome-extension-router';

const ContactContainer = styled.div`
  text-align: left;
  width: 310px;
  max-height: 290px;
  overflow: scroll;
`;

const pendingRequests = [
  { id: '1', requesterName: 'John Smith' },
  { id: '2', requesterName: 'Mary Smith' },
];

const contact = [
  { id: '1', friendName: 'Jane Doe' },
  { id: '2', friendName: 'Elon Musk' },
];

const Contact = () => {
  return (
    <ContactContainer>
      <h1>Contact</h1>
      <button onClick={() => goBack()}>Back</button>
      <h2>Add New Friends</h2>
      <input placeholder="Jane Doe"></input>
      <button>Add Friend</button>
      <h2>Pending Friend Requests</h2>
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

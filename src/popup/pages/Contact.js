/** @format */
import React from 'react';
import Popup from './Popup';
import styled from 'styled-components';
import { goBack } from 'react-chrome-extension-router';

const ContactContainer = styled.div`
  text-align: left;
  width: 310px;
  max-height: 290px;
  overflow: scroll;
`;

const Contact = () => {
  return (
    <ContactContainer>
      <h1>Contact</h1>
      <button onClick={() => goBack()}>Back</button>
    </ContactContainer>
  );
};

export default Contact;

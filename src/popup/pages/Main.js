/** @format */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import { goTo } from 'react-chrome-extension-router';

import { API_ENDPOINT, ACCESS_TOKEN } from '../config';
import Contact from './Contact';
import PFItem from '../components/PFItem';

import '../styles/Main.css';

const PopupContainer = styled.div`
  text-align: left;
  width: 310px;
  min-height: 400px;
  overflow: scroll;
`;

const ContentContainer = styled.div`
  margin: 20px;
`;

const Headline = styled.p`
  font-size: 20px;
  font-family: 'Avenir';
  font-weight: 600;
  color: white;
`;

const friends = [
  {
    name: 'John Smith',
    email: 'jsmith@gmail.com',
  },
  {
    name: 'Jasmine Doe',
    email: 'jdoe@gmail.com',
  },
  {
    name: 'Jane Westfield',
    email: 'jwestfield@gmail.com',
  },
];

const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : friends.filter(
        (friend) =>
          friend.name.toLowerCase().slice(0, inputLength) === inputValue
      );
};
const getSuggestionValue = (suggestion) => suggestion.name;
const renderSuggestion = (suggestion) => {
  return <span>{suggestion.name}</span>;
};

// Component
const Main = () => {
  const [recipient, setRecipient] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const onRecipientChanged = (e) => {
    setRecipient(e.target.value);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: 'Hit Enter to Send',
    value: recipient,
    onChange: onRecipientChanged,
    ref: (input) => input && input.focus(),
  };

  return (
    <PopupContainer>
      <ContentContainer>
        <Headline>Share this link with</Headline>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      </ContentContainer>
    </PopupContainer>
  );
};

export default Main;

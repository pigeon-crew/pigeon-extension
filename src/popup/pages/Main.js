/** @format */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Autosuggest from 'react-autosuggest';
import { goTo } from 'react-chrome-extension-router';

import Contact from './Contact';
import PFItem from '../components/PFItem';

import '../styles/Main.css';

const PopupContainer = styled.div`
  text-align: left;
  width: 310px;
  height: 400px;
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

// Component
const Main = ({ setLoggedIn }) => {
  const [recipient, setRecipient] = useState('');
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [myFeed, setMyFeed] = useState();

  const fetchMyFeed = () => {
    chrome.runtime.sendMessage({ type: 'fetchMyFeed' }, (response) => {
      if (response && response.success) {
        setMyFeed(response.links);
        return;
      }
    });
  };

  const fetchCurrentFriend = () => {
    chrome.runtime.sendMessage({ type: 'fetchCurrentFriend' }, (response) => {
      if (response && response.success) {
        setFriends(response.friend);
        return;
      }
    });
  };

  const handleSend = () => {
    const query = { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT };

    chrome.tabs.query(query, (tabs) => {
      const linkUrl = tabs[0].url;
      const recipientEmail = recipient;

      const payload = { linkUrl, recipientEmail };

      chrome.runtime.sendMessage({ type: 'sendLink', payload }, (response) => {
        if (response && response.success) {
          fetchMyFeed();
          alert('Link sent succesfully!');
          return;
        }
        alert('Error');
      });
    });
  };

  const logout = () => {
    chrome.runtime.sendMessage({ type: 'logout' }, (response) => {
      if (response && response.success) {
        setLoggedIn(false);
        return;
      }
      alert('Error');
    });
  };

  useEffect(() => {
    fetchCurrentFriend();
    fetchMyFeed();
  }, []);

  const handleEnterKey = (e) => {
    // if (e.key === 'Enter') {
    //   handleSend();
    //   e.preventDefault();
    // }

    console.log('todo');
  };

  // *******************************
  // BELOW ARE AUTOSUGGEST FUNCTIONS
  // *******************************

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : friends.filter((friend) => {
          const fullName = `${friend.firstName} ${friend.lastName}`;
          return fullName.toLowerCase().slice(0, inputLength) === inputValue;
        });
  };
  const getSuggestionValue = (suggestion) => suggestion.email;
  const renderSuggestion = (suggestion) => {
    return (
      <div>
        {suggestion.firstName} {suggestion.lastName}
      </div>
    );
  };

  // auto suggest related functions
  const onRecipientChanged = (e, { newValue }) => {
    setRecipient(newValue);
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
    onKeyDown: handleEnterKey,
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
        <button onClick={handleSend}>Send</button>
        <button onClick={() => goTo(Contact)}>Go To Contact</button>
        <button onClick={logout}>Logout</button>
        <Headline>Pigeon Feed</Headline>
        {myFeed && myFeed.length > 0 ? (
          myFeed.map((val) => {
            return <PFItem key={val._id} data={val} />;
          })
        ) : (
          <div>Your feed is empty oops</div>
        )}
      </ContentContainer>
    </PopupContainer>
  );
};

export default Main;

/** @format */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Autosuggest from 'react-autosuggest';
import { goTo } from 'react-chrome-extension-router';
import { FaSearch } from 'react-icons/fa';
import { IconContext } from 'react-icons';

import Contact from './Contact';
import PFItem from '../components/PFItem';
import Toast from '../components/Toast';
import CollapsibleInput from '../components/CollapsibleInput';

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
  margin: 5px;
  padding: 0px;
`;

const SearchButton = styled.div`
  margin-left: 143px;
  display: inline-block;

  &:hover {
    cursor: pointer;
  }
`;

const MoreButton = styled.button`
  text-align: center;
  display: inline-block;
   padding: 0.3em 1.2em;
   margin: 0 0.1em 0.1em 0;
   border: 0.16em solid rgba(255, 255, 255, 0);
   border-radius: 20px;
   box-sizing: border-box;
   text-decoration: none;
   font-family: 'Avenir';
   font-weight: 400;
   color: #ffffff;
   text-shadow: 0 0.04em 0.04em rgba(0, 0, 0, 0.35);
   text-align: center;
   transition: all 0.2s;
  background-color: #4e9af1;
  padding: 10px 50px;
  &:hover {
    cursor: pointer;
     border-color: rgba(255, 255, 255, 1);
  }
`;

const SecondaryButton = styled.button`
  border: none;
  background-color: inherit;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  font-family: 'Avenir';
   font-weight: 400;
   color: #ffffff;
  font-size: 12px;
`;

const validateEmail = (email) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

const Tips = [
  'Start typing for suggestions',
  'Hit Enter to send',
  'Hit Esc to hide suggestions',
];
const randomTips = Tips[Math.floor(Math.random() * Tips.length)];

// Component
const Main = ({ setLoggedIn }) => {
  const [recipient, setRecipient] = useState('');
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [toast, setToast] = useState({
    show: false,
    message: '',
  });
  const [input, setInput] = useState({
    show: false,
  });

  const [myFeed, setMyFeed] = useState();

  const fetchMyFeed = () => {
    const payload = { limit: 5 };
    chrome.runtime.sendMessage({ type: 'fetchMyFeed', payload }, (response) => {
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
        setSuggestions(response.friend);
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
          setToast({ show: true, message: '✅ Your link is sent succesfully' });
          // clear textfield
          setRecipient('');
          return;
        }
        console.log(response.error);
        setToast({ show: true, message: '😔 Oops. Something went wrong' });
      });
    });
  };

  const logout = () => {
    chrome.runtime.sendMessage({ type: 'logout' }, (response) => {
      if (response && response.success) {
        setLoggedIn(false);
        return;
      }
      setToast({ show: true, message: '😔 Oops. Something went wrong' });
    });
  };

  useEffect(() => {
    fetchCurrentFriend();
    fetchMyFeed();
  }, []);

  const handleEnterKey = (e) => {
    // only send when there are no suggestions left
    if (
      e.key === 'Enter' &&
      validateEmail(recipient) &&
      suggestions.length === 0
    ) {
      handleSend();
    }
    return;
  };

  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
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

  const onRecipientChanged = (e, { newValue }) => {
    setRecipient(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = () => {
    // clear suggestions after selected
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: randomTips,
    value: recipient,
    onChange: onRecipientChanged,
    onKeyDown: handleEnterKey,
    ref: (input) => input && input.focus(),
  };

  return (
    <PopupContainer>
      <ContentContainer>
        <Headline style={{ display: 'inline-block' }}>
          Share this link with
        </Headline>
        <Toast toast={toast} setToast={setToast} />
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          alwaysRenderSuggestions={true}
          focusInputOnSuggestionClick={true}
          highlightFirstSuggestion={false}
          onSuggestionSelected={onSuggestionSelected}
          inputProps={inputProps}
        />

        <Headline style={{ marginBottom: '15px', display: 'inline-block' }}>
          My Inbox
        </Headline>
        <SearchButton onClick={() => setInput({ show: !input.show })}>
          <IconContext.Provider value={{ color: 'white', size: '17px' }}>
            <FaSearch />
          </IconContext.Provider>
        </SearchButton>
        <CollapsibleInput input={input} setInput={setInput} />
        {myFeed && myFeed.length > 0 ? (
          <div>
            {myFeed.map((val) => {
              return <PFItem key={val._id} data={val} />;
            })}
            <MoreButton
              style={{ margin: '0px 0px 20px 50px' }}
              onClick={() => openURL('https://pigeon-webapp.herokuapp.com/')}
            >
              See More
            </MoreButton>
          </div>
        ) : (
          <div></div>
        )}
        <div style={{ marginLeft: '50px' }}>
          <SecondaryButton onClick={() => goTo(Contact)}>
            Manage Contact
          </SecondaryButton>
          <SecondaryButton onClick={logout}>Logout</SecondaryButton>
        </div>
      </ContentContainer>
    </PopupContainer>
  );
};

export default Main;

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

const validateEmail = (email) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

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
    placeholder: 'Hit Enter to Send',
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
        <div
          style={{ marginLeft: '143px', display: 'inline-block' }}
          onClick={() => setInput({ show: !input.show })}
        >
          <IconContext.Provider value={{ color: 'white', size: '17px' }}>
            <FaSearch />
          </IconContext.Provider>
        </div>
        <CollapsibleInput input={input} setInput={setInput} />
        {myFeed && myFeed.length > 0 ? (
          <div>
            {myFeed.map((val) => {
              return <PFItem key={val._id} data={val} />;
            })}
            <button
              onClick={() => {
                openURL('https://pigeon-webapp.herokuapp.com/');
              }}
            >
              See More
            </button>
          </div>
        ) : (
          <div></div>
        )}

        <button onClick={() => goTo(Contact)}>Go To Contact</button>
        <button onClick={logout}>Logout</button>
      </ContentContainer>
    </PopupContainer>
  );
};

export default Main;

/** @format */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import { goTo } from 'react-chrome-extension-router';

import { API_ENDPOINT, ACCESS_TOKEN } from '../../common/config';
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
const getSuggestionValue = (suggestion) => suggestion.email;
const renderSuggestion = (suggestion) => {
  return <div>{suggestion.name}</div>;
};

// Component
const Main = () => {
  const [recipient, setRecipient] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [myFeed, setMyFeed] = useState();

  const fetchMyFeed = () => {
    axios({
      url: `${API_ENDPOINT}/api/links/me`,
      method: 'POST',
      timeout: 0,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
      .then((res) => {
        const links = res.data.links;
        setMyFeed(links);
      })
      .catch((err) => {
        console.error(err.response);
      });
  };

  const handleSend = () => {
    const query = { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT };

    chrome.tabs.query(query, (tabs) => {
      const currentUrl = tabs[0].url;

      axios({
        url: `${API_ENDPOINT}/api/links/create`,
        method: 'POST',
        timeout: 0,
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          linkUrl: currentUrl,
          recipientEmail: recipient,
        }),
      })
        .then(() => {
          alert('Sent succesfully!');
          fetchMyFeed();
          // window.close();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    });
  };

  useEffect(() => {
    fetchMyFeed();
  }, []);

  const handleEnterKey = (e) => {
    // if (e.key === 'Enter') {
    //   handleSend();
    //   e.preventDefault();
    // }

    console.log('todo');
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

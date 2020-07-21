/** @format */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { goTo } from 'react-chrome-extension-router';

import { API_ENDPOINT, ACCESS_TOKEN } from '../config';
import Contact from './Contact';
import PFItem from '../components/PFItem';

const PopupContainer = styled.div`
  text-align: left;
  width: 310px;
  max-height: 290px;
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

const URLInputField = styled.input`
  width: 230px;
  border-radius: 12px;
  color: #797979;
  background-color: #f5f6f8;
  padding: 8px 16px;
  font-family: 'Avenir';
  font-weight: 400;
  font-size: 14px;
  border: 3px solid #f5f6f8;

  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }

  &:focus {
    outline: none;
    background: white;
    border: 3px solid #ff8686;
    color: black;
  }
`;

const Main = () => {
  const [recipient, setRecipient] = useState('');
  const [myFeed, setMyFeed] = useState();

  const onRecipientChanged = (e) => {
    setRecipient(e.target.value);
  };

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
        const data = res.data.data;
        console.log('FETCHED!!');
        console.log(data);
        setMyFeed(data);
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
    if (e.key === 'Enter') {
      handleSend();
      e.preventDefault();
    }
  };

  return (
    <PopupContainer>
      <ContentContainer>
        <Headline>Share this link with</Headline>
        <URLInputField
          ref={(input) => input && input.focus()}
          name="url"
          placeholder="Hit Enter to Send"
          value={recipient}
          onChange={onRecipientChanged}
          onKeyDown={handleEnterKey}
        />
        <button onClick={() => goTo(Contact)}>Go To Contact</button>
        <Headline>Pigeon Feed</Headline>
        {myFeed && myFeed.length > 0 ? (
          myFeed.map((val) => {
            return <PFItem key={val.id} data={val} />;
          })
        ) : (
          <div>Your feed is empty oops</div>
        )}
      </ContentContainer>
    </PopupContainer>
  );
};

export default Main;

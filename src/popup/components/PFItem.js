/** @format */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { parseISO, formatDistanceToNow } from 'date-fns';

const FeedContainer = styled.div`
  width: 240px;
  border-radius: 8px;
  background-color: #f5f6f8;
  margin: auto;
  padding: 2px 10px;
  margin-bottom: 20px;
`;

const LinkContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const Footer = styled.p`
  font-size: 12px;
  font-family: 'Avenir';
  font-weight: 400;
  color: #797979;
`;

const PFItem = ({ data }) => {
  const [linkpreview, setLinkPreview] = useState();

  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
  };

  const renderTimestamp = () => {
    const date = parseISO(data.timestamp);
    const timePeriod = formatDistanceToNow(date);

    return `${timePeriod} ago`.replace(/almost|about|over?/gi, '');
  };

  useEffect(() => {
    const payload = { url: data.linkUrl };

    chrome.runtime.sendMessage(
      { type: 'fetchLinkPreview', payload },
      (response) => {
        if (response && response.success) {
          const fetchedPreview = response.data;
          setLinkPreview(fetchedPreview);
          return;
        }
        console.error(response.error);
      }
    );
  }, []);

  return (
    <FeedContainer>
      <LinkContainer onClick={() => openURL(data.linkUrl)}>
        {linkpreview ? (
          <div>
            <img
              src={linkpreview.img}
              style={{
                height: '100px',
                width: '200px',
                objectFit: 'cover',
                margin: '10px',
              }}
            />
            <h3>{linkpreview.title}</h3>
            <p>{linkpreview.description}</p>
          </div>
        ) : (
          <div>
            <h3>Loading...</h3>
            <h3>{data.linkUrl}</h3>
          </div>
        )}
      </LinkContainer>
      <Footer>
        {data.senderName} | {renderTimestamp()}
      </Footer>
    </FeedContainer>
  );
};

export default PFItem;

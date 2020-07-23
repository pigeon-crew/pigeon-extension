/** @format */

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { parseISO, formatDistanceToNow } from 'date-fns';

const FeedContainer = styled.div`
  width: 240px;
  border-radius: 12px;
  background-color: #f5f6f8;
  margin: auto;
  padding: 2px 10px;
  margin-bottom: 20px;
`;

const URLHeader = styled.p`
  font-size: 14px;
  font-family: 'Avenir';
  font-weight: 600;
  color: #797979;

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
  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
  };

  const renderTimestamp = () => {
    const date = parseISO(data.timestamp);
    const timePeriod = formatDistanceToNow(date);

    return `${timePeriod} ago`.replace(/almost|about|over?/gi, '');
  };

  return (
    <FeedContainer>
      <URLHeader onClick={() => openURL(data.linkUrl)}>
        {data.linkUrl}
      </URLHeader>
      <Footer>
        {data.senderName} | {renderTimestamp()}
      </Footer>
    </FeedContainer>
  );
};

export default PFItem;

/** @format */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { parseISO, formatDistanceToNow } from 'date-fns';
import { getLinkPreview } from 'link-preview-js';

const FeedContainer = styled.div`
  width: 240px;
  border-radius: 12px;
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
    console.log(linkpreview);
    getLinkPreview(data.linkUrl).then((response) => {
      const { favicons, siteName, title, description } = response;
      setLinkPreview({ favicons, siteName, title, description });
    });
  }, []);

  return (
    <FeedContainer>
      <LinkContainer onClick={() => openURL(data.linkUrl)}>
        {linkpreview ? (
          <div>
            <img
              src={linkpreview.favicons[0]}
              style={{ height: '20px', width: '20px', display: 'inline-block' }}
            ></img>
            <h3>
              {linkpreview.siteName} | {linkpreview.title}
            </h3>
            <p>
              {linkpreview.description
                ? linkpreview.description.slice(0, 60)
                : ''}
            </p>
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

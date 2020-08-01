/** @format */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { parseISO, formatDistanceToNow } from 'date-fns';

const FeedContainer = styled.div`
  width: 260px;
  border-radius: 8px;
  background-color: white;
  margin: auto;
  padding: 10px 0px 10px 0px;
  margin-bottom: 20px;
`;

const LinkContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const Title = styled.div`
  font-size: 14px;
  font-family: 'Avenir';
  font-weight: 600;
  color: #2f3640;
`;

const Paragraph = styled.div`
  margin-top: 10px;
  font-size: 12px;
  font-family: 'Avenir';
  font-weight: 400;
  color: #2f3640;
`;

const ContentContainer = styled.div`
  padding: 15px;
  background-color: #ecf0f1;
`;

const SecondaryButton = styled.button`
  border: none;
  background-color: inherit;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  font-family: 'Avenir';
  font-weight: 600;
  color: #2f3640;
  font-size: 14px;
  outline-style: none;
`;

const PFItem = ({ data }) => {
  const [linkpreview, setLinkPreview] = useState();
  const [imageError, setImageError] = useState(false);

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

  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
  };

  const renderTimestamp = () => {
    const date = parseISO(data.timestamp);
    const timePeriod = formatDistanceToNow(date);

    return `${timePeriod} ago`
      .replace(/almost|about|over|ago?/gi, '')
      .replace(/\s/gi, '')
      .replace(/lessthanaminute?/gi, '1minutes')
      .replace(/minutes?/gi, 'min')
      .replace(/days?/gi, 'd')
      .replace(/hours?/gi, 'h');
  };

  return (
    <FeedContainer>
      <div style={{ padding: '0px 10px 10px 10px' }}>
        <Title>
          {data.senderName} {renderTimestamp()}
        </Title>
        {data.message && <Paragraph>{data.message}</Paragraph>}
      </div>
      <LinkContainer
        onClick={() => openURL(data.linkUrl)}
        style={{
          padding: '0 px',
          minHeight: '50px',
        }}
      >
        {linkpreview ? (
          <div>
            {linkpreview.img && !imageError && (
              <img
                src={linkpreview.img}
                onError={() => setImageError(true)}
                style={{
                  height: '120px',
                  width: '260px',
                  objectFit: 'cover',
                }}
              />
            )}

            <ContentContainer>
              <Title>
                <img
                  src={linkpreview.favicon}
                  style={{ padding: 0, marginRight: '5px' }}
                />
                {linkpreview.title}
              </Title>
              <Paragraph>{data.linkUrl}</Paragraph>
            </ContentContainer>
          </div>
        ) : (
          <ContentContainer>
            <Title>{data.linkUrl}</Title>
            <Paragraph>Loading...</Paragraph>
          </ContentContainer>
        )}
      </LinkContainer>
      <SecondaryButton>👍 Like</SecondaryButton>
      <SecondaryButton>🚀 Comment</SecondaryButton>
      <SecondaryButton>✅ Done</SecondaryButton>
    </FeedContainer>
  );
};

export default PFItem;

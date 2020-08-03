/** @format */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { parseISO, formatDistanceToNow } from 'date-fns';

const FeedContainer = styled.div`
  width: 260px;
  border-radius: 8px;
  background-color: white;
  margin: auto;
  padding: 7px 0px 7px 0px;
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

const URLTitle = styled.div`
  font-size: 14px;
  font-family: 'Avenir';
  font-weight: 600;
  color: #2f3640;
`;

const Paragraph = styled.div`
  margin-top: 12px;
  font-family: 'Avenir';
  font-weight: 400;
  color: #2f3640;
`;

const ContentContainer = styled.div`
  padding: 3px 8px 10px 8px;
  background-color: #ecf0f1;
`;

const SecondaryButton = styled.button`
  border: none;
  background-color: inherit;
  font-size: 16px;
  display: inline-block;
  font-family: 'Avenir';
  font-weight: 600;
  color: #2f3640;
  font-size: 14px;
  outline-style: none;
  cursor: pointer;
  border-radius: 20px;
  padding: 2px 20px 5px 20px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const ButtonContainer = styled.div`
  margin: 6px 0px 0px 0px;
  padding: 0px;
  display: flex;
  justify-content: space-around;
`;

const Divider = styled.hr`
  border-top: 0.5px solid #ecf0f1;
  margin: 8px 10px 0px 10px;
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

  const shortenString = (str) => {
    if (str.length < 35) {
      return str;
    }
    return `${str.substring(0, 30)}...`;
  };

  return (
    <FeedContainer>
      <div style={{ padding: '0px 10px 10px 10px' }}>
        <Title style={{ display: 'inline-block' }}>{data.senderName}</Title>
        <Paragraph
          style={{
            display: 'inline-block',
            marginLeft: '5px',
            color: '#7f8c8d',
          }}
        >
          {renderTimestamp()}
        </Paragraph>
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
                  height: '100px',
                  width: '260px',
                  objectFit: 'cover',
                }}
              />
            )}

            <ContentContainer>
              <Paragraph style={{ fontSize: '10px', color: '#7f8c8d' }}>
                {linkpreview.domain.toUpperCase()}
              </Paragraph>
              <URLTitle>
                <img
                  src={linkpreview.favicon}
                  style={{ padding: 0, marginRight: '5px' }}
                />
                {linkpreview.title}
              </URLTitle>
            </ContentContainer>
          </div>
        ) : (
          <ContentContainer>
            <Paragraph style={{ color: '#7f8c8d' }}>Loading...</Paragraph>
            <URLTitle>{shortenString(data.linkUrl)}</URLTitle>
          </ContentContainer>
        )}
      </LinkContainer>
      <Divider />
      <ButtonContainer>
        <SecondaryButton>👍 Like</SecondaryButton>
        <SecondaryButton>✅ Done</SecondaryButton>
      </ButtonContainer>
    </FeedContainer>
  );
};

export default PFItem;

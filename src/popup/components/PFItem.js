/** @format */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { parseISO, formatDistanceToNow } from 'date-fns';

const FeedContainer = styled.div`
  width: 260px;
  border-radius: 8px;
  background-color: #f5f6f8;
  margin: auto;
  padding: 0px;
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
  padding: 10px;
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
  padding: 10px 10px 0px 10px;
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
          console.log(fetchedPreview);
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

    return `${timePeriod} ago`.replace(/almost|about|over?/gi, '');
  };

  return (
    <FeedContainer>
      <LinkContainer onClick={() => openURL(data.linkUrl)}>
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
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px',
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
              <Paragraph>{linkpreview.description}</Paragraph>
            </ContentContainer>
          </div>
        ) : (
          <div>
            <ContentContainer>
              <Title>Loading...</Title>
              <Paragraph>{data.linkUrl}</Paragraph>
            </ContentContainer>
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

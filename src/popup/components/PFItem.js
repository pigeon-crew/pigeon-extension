/** @format */

import React, { useEffect } from 'react';
import styled from 'styled-components';

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
`;

const Footer = styled.p`
  font-size: 12px;
  font-family: 'Avenir';
  font-weight: 400;
  color: #797979;
`;

const PFItem = ({ data }) => {
  useEffect(() => {
    console.log(data);
  }, []);

  return (
    <FeedContainer>
      <URLHeader>{data.linkUrl}</URLHeader>
      <Footer>
        {data.senderName} | {data.timestamp}
      </Footer>
    </FeedContainer>
  );
};

export default PFItem;

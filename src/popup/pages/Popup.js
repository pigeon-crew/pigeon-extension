/** @format */

import React from "react";
import styled from "styled-components";
import PFItem from "../components/PFItem";

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
  font-family: "Avenir";
  font-weight: 600;
  color: white;
`;

// TODO: Eventually use Formik to hook up?
const URLInputField = styled.input`
  width: 230px;
  border-radius: 12px;
  color: #797979;
  background-color: #f5f6f8;
  padding: 8px 16px;
  font-family: "Avenir";
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

const fakeData = [
  {
    sender: "Jane Doe",
    link: "The Verge was founded in 2011 in partnership with Vox Media",
    timestamp: "5hrs ago",
  },
  {
    sender: "John Smith",
    link: "The Verge was founded in 2011 in partnership with Vox Media",
    timestamp: "5hrs ago",
  },
  {
    sender: "John Smith",
    link: "The Verge was founded in 2011 in partnership with Vox Media",
    timestamp: "5hrs ago",
  },
  {
    sender: "John Smith",
    link: "The Verge was founded in 2011 in partnership with Vox Media",
    timestamp: "5hrs ago",
  },
  {
    sender: "John Smith",
    link: "The Verge was founded in 2011 in partnership with Vox Media",
    timestamp: "5hrs ago",
  },
];

const Popup = () => {
  return (
    <PopupContainer>
      <ContentContainer>
        <Headline>Share this link with</Headline>
        <URLInputField name="url" placeholder="Hit Enter to Send" />
        <Headline>Pigeon Feed</Headline>
        {fakeData.map((val) => {
          return <PFItem data={val} />;
        })}
      </ContentContainer>
    </PopupContainer>
  );
};

export default Popup;

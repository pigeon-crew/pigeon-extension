import React from "react";
import styled from "styled-components";

const PopupContainer = styled.div`
  text-align: center;
  width: 310px;
  min-height: 290px;
`;

const Headline = styled.p`
  font-size: 20px;
  font-family: "Avenir";
  font-weight: 600;
  color: white;
`;

// TODO: Eventually use Formik to hook up?
const URLInputField = styled.input`
  width: 200px;
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

const FeedContainer = styled.div`
  width: 200px;
  border-radius: 12px;
  background-color: #f5f6f8;
  height: 40px;
  margin: auto;
  margin-bottom: 20px;
`;

const Popup = () => {
  return (
    <PopupContainer>
      <Headline>Share this link with</Headline>
      <URLInputField name="url" placeholder="Hit Enter to Send" />
      <Headline>Pigeon Feed</Headline>
      <FeedContainer />
      <FeedContainer />
    </PopupContainer>
  );
};

export default Popup;

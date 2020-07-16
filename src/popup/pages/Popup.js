import React from "react";
import styled from "styled-components";

const PopupContainer = styled.div`
  text-align: center;
  width: 410px;
  min-height: 290px;
`;

const Popup = () => {
  return (
    <PopupContainer>
      <h1>Hey! This is Pigeon</h1>
      <p>Our mission is to make link sharing easy and fun for you.</p>
    </PopupContainer>
  );
};

export default Popup;

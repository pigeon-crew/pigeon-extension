/** @format */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { goBack } from "react-chrome-extension-router";
import FriendReqItem from "../components/FriendReqItem";

// TODO: Consolidate Headline, Subtitle, Desc into one component with font size as a prop

const Headline = styled.h1`
  font-size: 20px;
  font-family: "Avenir";
  font-weight: 600;
  color: white;
  margin: 10px 0;
  padding: 0px;
  /*text-align: center;*/
`;

const Subtitle = styled.h3`
  font-size: 16px;
  font-family: "Avenir";
  font-weight: 600;
  color: #f5f5f5;
  margin: 20px 0 0 0;
  padding: 0px;
`;

const Desc = styled.div`
  font-size: 14px;
  font-family: "Avenir";
  font-weight: 500;
  color: white;
  margin: 10px 0px 15px 0px;
`;

const StyledButton = styled.button`
  border: none;
  background-color: #f5f5f5;
  padding: 5px 15px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  font-family: "Avenir";
  font-size: 12px;
  font-weight: 600px;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 10px;
    opacity: 0.9;
    background-color: rgba(231, 84, 128, 1);
  }
  &:active {
    opacity: 0.6;
  }
`;

const StyledInput = styled.input`
  width: 225px;
  height: 30px;
  padding: 5px 20px;
  font-family: Helvetica, sans-serif;
  font-weight: 300;
  font-size: 16px;
  border: 1px solid #aaa;
  border-radius: 8px;
  margin: 10px 0px 10px 0px;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: start;
  appearance: textfield;
  background-color: -internal-light-dark(rgb(255, 255, 255), rgb(59, 59, 59));
  -webkit-rtl-ordering: logical;
  cursor: text;

  &:focus {
    outline: none;
  }

  &:active {
    outline: none;
  }
`;

const ContactContainer = styled.div`
  text-align: left;
  width: 310px;
  height: 400px;
  overflow: scroll;
`;

const validateEmail = (email) => {
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegexp.test(email);
};

const Contact = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [email, setEmail] = useState("");

  const fetchPendingRequests = () => {
    chrome.runtime.sendMessage({ type: "fetchPendingFriends" }, (response) => {
      if (response && response.success) {
        setPendingRequests(response.request);
        return;
      }
      alert("Fetch Pending Request Error");
    });
  };

  const handleAccept = (friendReqId) => {
    const payload = { friendReqId };

    chrome.runtime.sendMessage(
      { type: "acceptRequest", payload },
      (response) => {
        if (response && response.success) {
          fetchPendingRequests();
          return;
        }
        alert("Accept Request Error");
      }
    );
  };

  const handleReject = (friendReqId) => {
    const payload = { friendReqId };

    chrome.runtime.sendMessage(
      { type: "rejectRequest", payload },
      (response) => {
        if (response && response.success) {
          fetchPendingRequests();
          return;
        }
        alert("Reject Request Error");
      }
    );
  };

  const handleSendRequest = () => {
    if (!validateEmail(email)) return;

    const payload = { email };
    chrome.runtime.sendMessage(
      { type: "sendFriendRequest", payload },
      (response) => {
        if (response && response.success) {
          alert("Friend request sent!");
          return;
        }
        alert("Friend Request Error");
      }
    );
  };

  const handleEmailChanged = (e) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <ContactContainer>
      <Headline>Manage Contacts</Headline>
      <StyledButton onClick={() => goBack()}>Back</StyledButton>
      <Subtitle>Add Friends</Subtitle>
      <StyledInput
        placeholder="Email"
        value={email}
        onChange={handleEmailChanged}
      ></StyledInput>
      <StyledButton onClick={handleSendRequest}>Send Request</StyledButton>
      <Subtitle>Pending Requests</Subtitle>
      {pendingRequests && pendingRequests.length > 0 ? (
        pendingRequests.map((data) => {
          return (
            <FriendReqItem
              key={data._id}
              data={data}
              handleAccept={handleAccept}
              handleReject={handleReject}
            />
          );
        })
      ) : (
        <Desc>You have no pending requests</Desc>
      )}
    </ContactContainer>
  );
};

export default Contact;

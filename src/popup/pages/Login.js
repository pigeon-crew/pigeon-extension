/** @format */
import React, { useState, useEffect } from 'react';
import Main from './Main';
import styled from 'styled-components';
import { goTo } from 'react-chrome-extension-router';

const LoginContainer = styled.div`
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
  font-family: 'Avenir';
  font-weight: 600;
  color: white;
`;

const InputField = styled.input`
  width: 230px;
  border-radius: 12px;
  color: #797979;
  background-color: #f5f6f8;
  padding: 8px 16px;
  font-family: 'Avenir';
  font-weight: 400;
  font-size: 14px;
  border: 3px solid #f5f6f8;
  margin-bottom: 20px;

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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const message = {
      type: 'setLogin',
      payload: {
        email,
        password,
      },
    };

    chrome.runtime.sendMessage(message, (response) => {
      alert(response);
    });
    //goTo(Main)
  };

  const handleEmailChanged = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChanged = (e) => {
    setPassword(e.target.value);
  };

  return (
    <LoginContainer>
      <ContentContainer>
        <Headline>Login</Headline>
        <p>
          Don't have an account yet? <a href="#">Sign Up</a>
        </p>
        <InputField
          ref={(input) => input && input.focus()}
          placeholder="Email"
          value={email}
          onChange={handleEmailChanged}
        />
        <InputField
          placeholder="Password"
          type="password"
          value={password}
          onChange={handlePasswordChanged}
        />
        <button onClick={handleLogin}>Done</button>
      </ContentContainer>
    </LoginContainer>
  );
};

export default Login;

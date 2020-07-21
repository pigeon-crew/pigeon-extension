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

const Login = () => {
  return (
    <LoginContainer>
      <h1>Login</h1>
      <button onClick={() => goTo(Main)}>Done</button>
    </LoginContainer>
  );
};

export default Login;

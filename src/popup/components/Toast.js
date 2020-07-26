/** @format */

import React, { useEffect, useState } from 'react';

const Toast = ({ toast, setToast }) => {
  useEffect(() => {
    setTimeout(() => {
      setToast({ show: false, message: toast.message });
    }, 2500);
  }, [toast, setToast]);

  return (
    <>
      {toast.show ? (
        <p
          style={{
            margin: '0px 0px 5px 0px',
            padding: '2px',
            fontSize: '12px',
            fontFamily: 'Avenir',
            fontWeight: 500,
            color: 'white',
            textAlign: 'center',
          }}
        >
          {toast.message}
        </p>
      ) : (
        <></>
      )}
    </>
  );
};

export default Toast;

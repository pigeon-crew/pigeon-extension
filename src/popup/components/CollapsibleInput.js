/** @format */

import React, { useEffect, useState } from 'react';

const CollapsibleInput = ({ input, setInput }) => {
  return (
    <>
      {input.show ? (
        <input
          placeholder="Search for Past Links"
          style={{
            width: '225px',
            height: '30px',
            padding: '10px 20px',
            fontFamily: 'Helvetica, sans-serif',
            fontWeight: '300',
            fontSize: '16px',
            border: '1px solid #aaa',
            borderRadius: '8px',
            margin: '0px 0px 20px 0px',
          }}
        ></input>
      ) : (
        <></>
      )}
    </>
  );
};

export default CollapsibleInput;

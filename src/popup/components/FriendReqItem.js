/** @format */

import React, { useEffect } from 'react';

const FriendReqItem = ({ data, handleAccept, handleReject }) => {
  useEffect(() => {
    console.log(data);
  }, []);

  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
  };

  return (
    <div key={data._id}>
      <h3>{data.requesterName}</h3>
      <button
        onClick={() => {
          handleAccept(data._id);
        }}
      >
        Accept
      </button>
      <button
        onClick={() => {
          handleReject(data._id);
        }}
      >
        Reject
      </button>
    </div>
  );
};

export default FriendReqItem;

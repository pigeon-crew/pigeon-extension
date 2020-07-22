/** @format */

import React from 'react';

const FriendReqItem = ({ data }) => {
  useEffect(() => {
    console.log(data);
  }, []);

  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
  };

  return (
    <div>
      <h3>{val.requesterName}</h3>
      <button>Accept</button>
      <button>Reject</button>
    </div>
  );
};

export default FriendReqItem;

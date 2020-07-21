/** @format */

console.log('Background.js file loaded');

/* const defaultUninstallURL = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://wwww.github.com/kryptokinght'
    : '';
}; */

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.type) {
    case 'setLogin':
      // perform login action here
      console.log('background.js: performing login action..');
      response(msg.payload.email);
      break;
    case 'getLoginStatus':
      response({ loggedIn: false });
    default:
      response('unknown request');
      break;
  }
});

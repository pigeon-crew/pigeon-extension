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
      // fake login
      response({ success: true, message: 'Logged in succesfully.' });
      break;
    case 'getLoginStatus':
      response({ success: false, message: 'User is logged in already.' });
      break;
    default:
      response('unknown request');
      break;
  }
});

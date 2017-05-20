// @flow
import slackAuth from './index';

// https://slack.com/oauth/authorize?&client_id=2177882080.186798670246&scope=channels:read,chat:write:bot

slackAuth({
  client_id: '2177882080.186798670246',
  scope: 'channels:read,chat:write:bot',
});

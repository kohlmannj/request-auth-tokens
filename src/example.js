import collectAuthTokens from './collectAuthTokens';
import SlackService from './services/Slack';

require('dotenv').config(); // eslint-disable-line import/no-extraneous-dependencies

collectAuthTokens(
  [
    new SlackService({
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      reason: 'post staging link updates to Slack channels',
    }),
  ],
  {
    name: 'scaffolding-next',
    reason: 'upload multiple encrypted access tokens to Travis CI',
  },
).then(([slackToken]) => {
  console.log('Slack Token:', slackToken);
});

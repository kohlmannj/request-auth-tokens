/* eslint-disable camelcase */
import requestAuthTokens from '../../requestAuthTokens';
import SlackService from '../Slack';

require('dotenv').config(); // eslint-disable-line import/no-extraneous-dependencies

const client_id = process.env.SLACK_CLIENT_ID;
const client_secret = process.env.SLACK_CLIENT_SECRET;
const reason = 'post updates to Slack channels';

describe('Slack service class', () => {
  it(
    'receives a token after the user successfully authorizes the Slack app',
    async () => {
      expect.assertions(1);
      await expect(
        requestAuthTokens([new SlackService({ client_id, client_secret, reason })], {
          reason: 'test the Slack service class. The received token will be immediately discarded',
        }),
      ).resolves.toEqual(expect.arrayContaining([expect.any(String)]));
    },
    300000,
  );
});

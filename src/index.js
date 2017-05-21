// @flow
import 'babel-polyfill'; // eslint-disable-line
// import isCI from 'is-ci';
import express from 'express';
import open from 'open';
import request from 'request';
import enableDestroy from 'server-destroy';

require('dotenv').config();

const SLACK_AUTH_SERVER_HOSTNAME = 'localhost';
const SLACK_AUTH_SERVER_ROUTE = '/auth/slack';
const SLACK_AUTH_SERVER_PORT = 1989;
const SLACK_AUTH_OPTIONS = {
  client_id: process.env.SLACK_CLIENT_ID,
  scope: 'channels:read,chat:write:bot',
};

type SlackAuthParams = {
  client_id: string,
  scope: string,
  redirect_uri?: string,
  state?: string,
  team?: boolean,
};

const localSlackOAuthRedirectUri = `http://${SLACK_AUTH_SERVER_HOSTNAME}:${SLACK_AUTH_SERVER_PORT}${SLACK_AUTH_SERVER_ROUTE}`;

const reduceOptions = (options: SlackAuthParams) =>
  Object.entries(options).reduce(
    (accStr: string, [param: string, value: string]) => `${accStr}&${param}=${value}`,
    '',
  );

const getSlackAuthUri = (options: SlackAuthParams): string =>
  `https://slack.com/oauth/authorize?${reduceOptions(options)}`;

const terminateServer = (server: http.Server) => {
  server.close();
  setImmediate(() => {
    server.emit('close');
  });
};

const createSlackAuthServerPromise = (): Promise<string> =>
  new Promise((resolve, reject) => {
    const app: express$Application = express();
    let server: http.Server;

    app.get(SLACK_AUTH_SERVER_ROUTE, (req, res) => {
      const requestOptions = {
        uri: `https://slack.com/api/oauth.access?code=${req.query.code}&client_id=${process.env.SLACK_CLIENT_ID || ''}&client_secret=${process.env.SLACK_CLIENT_SECRET || ''}&redirect_uri=${localSlackOAuthRedirectUri}`,
        method: 'GET',
      };

      request(requestOptions, (error, response, body) => {
        const JSONresponse = JSON.parse(body);
        if (!JSONresponse.ok) {
          res.send(`Error encountered: \n${JSON.stringify(JSONresponse)}`).status(200).end();
          reject(JSONresponse);
        } else if (JSONresponse.access_token) {
          res.send('Success!');
          resolve(JSONresponse.access_token);
          terminateServer(server);
        } else {
          res
            .send(`Did not receive access_token in response: \n${JSON.stringify(JSONresponse)}`)
            .status(200)
            .end();
          reject(JSONresponse);
        }
      });
    });

    server = app.listen(SLACK_AUTH_SERVER_PORT, () => {
      console.log('Auth server running...');
    });

    enableDestroy(server);
  });

const getSlackAuthToken = (
  options: SlackAuthParams,
): { authUri: string, authPromise: Promise<string>, authServer: http.Server } => {
  const authUri: string = getSlackAuthUri({
    ...options,
    redirect_uri: localSlackOAuthRedirectUri,
  });

  let authServer: http.Server;

  const authPromise = createSlackAuthServerPromise();

  return { authUri, authPromise, authServer };
};

export default function(
  { slack }: Object = {
    slack: SLACK_AUTH_OPTIONS,
  },
) {
  // Create an Express server to handle Slack's redirect request
  const { authUri, authPromise } = getSlackAuthToken(slack);
  authPromise
    .then((token: string) => {
      console.log(`Success! ${token}`);
    })
    .catch(() => {
      console.log('Error! (TODO: offer option to try again)');
    });

  open(authUri);
}

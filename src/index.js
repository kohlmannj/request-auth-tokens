// @flow
import 'babel-polyfill'; // eslint-disable-line
import { config } from 'dotenv';
// import express from 'express';
import open from 'open';
// import request from 'request';

config();

type AuthorizationParameters = {
  client_id: string,
  scope: string,
  redirect_uri?: string,
  state?: string,
  team?: boolean,
};

const reduceOptions = (options: AuthorizationParameters) =>
  Object.entries(options).reduce(
    (accStr: string, [param: string, value: string]) => `${accStr}&${param}=${value}`,
    '',
  );

const getSlackAuthUri = (options: AuthorizationParameters) =>
  `https://slack.com/oauth/authorize?${reduceOptions(options)}`;

export default function(options: AuthorizationParameters) {
  // Open the auth page in the user's browser
  const authUri = getSlackAuthUri(options);
  open(authUri);
}

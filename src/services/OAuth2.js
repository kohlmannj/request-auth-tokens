/* eslint-disable camelcase */
export default class OAuth2 {
  type = 'OAuth2';

  constructor({ client_id, client_secret, reason }) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.reason = reason;
  }
}

/* eslint-disable camelcase */
export default class OAuth2 {
  type = 'OAuth2';

  constructor(options) {
    if (typeof options !== 'object' || options === null) {
      throw new Error('Attempting to construct without passing any options');
    }
    const { client_id, client_secret, reason } = options;
    if (typeof client_id !== 'string') {
      throw new Error('Attempting to construct without a client_id');
    }
    if (typeof client_secret !== 'string') {
      throw new Error('Attempting to construct without a client_secret');
    }
    if (typeof reason !== 'string' || (typeof reason === 'string' && reason.trim() === '')) {
      throw new Error('Attempting to construct without a reason');
    }
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.reason = reason;
  }
}

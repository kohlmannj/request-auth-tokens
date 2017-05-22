/* eslint-disable camelcase */
import OAuth2Service from '../OAuth2';

const client_id = 'test_id';
const client_secret = 'test_secret';
const reason = 'test_reason';

describe('OAuth2 service class', () => {
  it('throws an error when constructed without any arguments', () => {
    expect(() => {
      new OAuth2Service(); // eslint-disable-line no-new
    }).toThrowError();
  });

  it('throws an error when constructed without a client_id', () => {
    expect(() => {
      new OAuth2Service({ client_secret, reason }); // eslint-disable-line no-new
    }).toThrowError(/client_id/);
  });

  it('throws an error when constructed without a client_secret', () => {
    expect(() => {
      new OAuth2Service({ client_id, reason }); // eslint-disable-line no-new
    }).toThrowError(/client_secret/);
  });

  it('throws an error when constructed without a reason', () => {
    expect(() => {
      new OAuth2Service({ client_id, client_secret }); // eslint-disable-line no-new
    }).toThrowError(/reason/);
  });
});

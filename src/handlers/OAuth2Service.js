import getDefaultButton from '../utils/getDefaultButton';
import getUrlWithQuery from '../utils/getUrlWithQuery';
/* eslint-disable camelcase */
export default function(service, redirect_uri) {
  const handledService = service;
  const { requestUrl, accessUrl, client_id, client_secret, scope, state } = handledService;
  // Use the default button generator code
  if (typeof handledService.button === 'undefined') {
    handledService.button = getDefaultButton;
  }

  // Get the application request URL (to use with the button)
  if (typeof handledService.appRequestUrl !== 'string') {
    handledService.appRequestUrl = getUrlWithQuery({
      url: requestUrl,
      query: {
        client_id,
        redirect_uri,
        scope,
        state,
      },
    });
  }

  // Get the application access URL (to request the OAuth2.js token)
  if (typeof handledService.getAppAccessUrl !== 'function') {
    handledService.getAppAccessUrl = ({ code }) =>
      getUrlWithQuery({
        url: accessUrl,
        query: {
          code,
          client_id,
          client_secret,
          redirect_uri,
        },
      });
  }

  // Call button() if it's a function
  if (typeof handledService.button === 'function') {
    handledService.button = handledService.button(handledService);
  }

  return handledService;
}

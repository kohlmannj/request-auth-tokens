/* eslint-disable camelcase */
// import isCI from 'is-ci';
import express from 'express';
import request from 'request';
import callerModule from 'caller';
import enableDestroy from 'server-destroy';
import open from 'open';
import merge from 'lodash.merge';
import handleOAuth2Service from './handlers/OAuth2Service';
import createIndexRoute from './utils/createIndexRoute';
import pkg from '../package.json';

const defaults = {
  hostname: 'localhost',
  port: 1989,
  prompts: {
    initial: 'Click the links below to log in and authorize each service.',
    allDone: '<strong style="color: #009900">All services are authorized!</strong> ' +
      'You may now close this window.',
  },
  protocol: 'http',
  routePrefix: '/auth/',
  statuses: {
    initial: '⬅️ Click to Authorize',
    success: '✅ Authorized!',
    error: '❌ (Click to try again)',
  },
  timeout: 300000, // 5 minutes
  title: 'Authorize Services',
};

export default function(services, options) {
  const settings = merge(defaults, options);
  const {
    app: appOption,
    name,
    hostname,
    port,
    prompts,
    reason,
    statuses,
    protocol,
    routePrefix,
    // timeout,
    title,
  } = settings;
  const callerPath = callerModule();
  let handledServices = [];
  let app = appOption;
  let server;

  if (typeof reason !== 'string') {
    throw new Error('No reason provided');
  }

  // Create our own Express app and start our own server if no `app` was provided as an argument
  if (typeof app !== 'object' || app === 'null') {
    app = express();
    server = app.listen(port);
    enableDestroy(server);
  }

  const getLocalRedirectUriForService = (service = { name: '' }, withHostUrl = false) => {
    const hostUrl = withHostUrl ? `${protocol}://${hostname}:${port}` : '';
    const trailingSlash = routePrefix[routePrefix.length - 1] === '/' ? '' : '/';
    return `${hostUrl}${routePrefix}${trailingSlash}${service.name}`;
  };

  const indexUri = getLocalRedirectUriForService(undefined, true);

  const getOAuth2Promise = service => {
    const redirectUri = getLocalRedirectUriForService(service);
    const requestRedirectUri = `${redirectUri}/request`;

    // Create a convenience URL to redirect the user to the service provider's request URL
    app.get(requestRedirectUri, (req, res) => {
      res.redirect(service.appRequestUrl);
    });

    return new Promise(resolve => {
      app.get(redirectUri, ({ query: { code } }, res) => {
        const uri = service.getAppAccessUrl({ code });
        const requestOptions = { uri, method: 'GET' };

        const serviceIndex = handledServices.findIndex(s => s.name === service.name);

        request(requestOptions, (error, response, body) => {
          const JSONresponse = JSON.parse(body);
          if (!JSONresponse.ok) {
            // Note that we failed to get an access token for this service
            if (serviceIndex > -1) {
              handledServices[serviceIndex].access_token = null;
            }
            res.redirect(indexUri);
            // res.send(`Error encountered: \n${JSON.stringify(JSONresponse)}`).status(200).end();
            // reject(JSONresponse);
          } else if (JSONresponse.access_token) {
            // Add the access token to the service
            if (serviceIndex > -1) {
              handledServices[serviceIndex].access_token = JSONresponse.access_token;
            }
            res.redirect(indexUri);
            resolve(JSONresponse.access_token);
          } else {
            // Note that we failed to get an access token for this service
            if (serviceIndex > -1) {
              handledServices[serviceIndex].access_token = null;
            }
            res
              .send(`Did not receive access_token in response: \n${JSON.stringify(JSONresponse)}`)
              .status(200)
              .end();
            // reject(JSONresponse);
          }
        });
      });
    });
  };

  const addOAuth2Service = service => {
    const redirect_uri = getLocalRedirectUriForService(service, true);
    const handledService = handleOAuth2Service(service, redirect_uri);
    handledService.promise = getOAuth2Promise(handledService);

    return handledService;
  };

  const add = service => {
    if (typeof service.type !== 'string') {
      throw new Error('Attempting to add an invalid service type.');
    }

    switch (service.type) {
      case 'OAuth2':
        return addOAuth2Service(service);
      // case 'OAuth1.0A':
      //   return addOAuth1AService(service);
      default:
        throw new Error('Attempting to add an unsupported service version.');
    }
  };

  // const destroyServer = () => {
  //   if (typeof server === 'object' && server !== null) {
  //     server.destroy();
  //   }
  // };

  // Init
  handledServices = services.map(add);

  createIndexRoute({
    app,
    callerPath,
    name,
    pkg,
    prompts,
    reason,
    services: handledServices,
    statuses,
    title,
    uri: getLocalRedirectUriForService(),
  });
  open(indexUri);

  const tokenPromise = Promise.all(handledServices.map(service => service.promise));
  // tokenPromise.then(destroyServer).catch(destroyServer);
  return tokenPromise;
}

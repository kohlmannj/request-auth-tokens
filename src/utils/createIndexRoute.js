export default ({
  app,
  name,
  callerPath,
  prompts,
  reason,
  services,
  statuses,
  title,
  uri,
  version,
}) => {
  app.get(uri, (req, res) => {
    let localName = name;
    if (typeof localName !== 'string') {
      const callerSplit = callerPath.split('/');
      localName = callerSplit[callerSplit.length - 1];
    }

    let responseHtml =
      `<html><head><title>${title} · Requested by ${localName}</title><style type="text/css">body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; max-width: 640px; margin: 2em auto; text-align: center; } h1 { margin-bottom: 0} h1 + .meta { margin-top: 0; } .meta { color: #808080; } .meta a { color: #333; } .caller { color: #333; cursor: help; } table { margin: 0 auto; } td { padding: 0.5em }</style></head><body>` +
      `<h1>${title}</h1>` +
      `<p class="meta"><span class="caller" title="${callerPath}">${localName}</span> is asking to ${reason}.</p>`;
    let message = prompts.initial;

    const allServicesAreAuthorized = services
      .map(s => typeof s.access_token === 'string')
      .reduce((l, r) => l && r, true);

    if (allServicesAreAuthorized === true) {
      message = prompts.allDone;
    }

    responseHtml += `<p>${message}</p>`;

    const serviceButtons = services.reduce((previousText, service) => {
      let tokenStatus = statuses.initial;
      if (typeof service.access_token === 'string') {
        tokenStatus = statuses.success;
      } else if (service.access_token === null) {
        tokenStatus = statuses.error;
      }

      return `${previousText}<tr><td>${service.button}</td><td>${tokenStatus}</td><td>${service.reason || '–'}`;
    }, '');

    responseHtml +=
      `<table><tr><th>Service</th><th>Status</th><th>Reason</th></tr>${serviceButtons}</table>` +
      `<small class="meta">Provided by <a href="https://github.com/kohlmannj/oauth-token-collector">oauth-token-collector</a> v${version}` +
      '</body></html>';

    res.send(responseHtml);
  });
};

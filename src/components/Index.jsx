import React from 'react';
import PropTypes from 'prop-types';

const Index = ({ name, callerPath, pkg, prompts, reason, services, statuses, title, uri }) => {
  let localName = name;
  if (typeof localName !== 'string') {
    const callerSplit = callerPath.split('/');
    localName = callerSplit[callerSplit.length - 1];
  }

  return (
    <html>
      <head>
        <title>{title} · Requested by {localName}</title>
        <style type="text/css">body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; max-width: 640px; margin: 2em auto; text-align: center; } h1 { margin-bottom: 0} h1 + .meta { margin-top: 0; } .meta { color: #808080; } .meta a { color: #333; } .caller { color: #333; cursor: help; } table { margin: 0 auto; } td { padding: 0.5em }</style>
      </head>
    </html>
  )
};

Index.propTypes = {
  name: PropTypes.string,
  callerPath: PropTypes.string,
  prompts: PropTypes.arrayOf(PropTypes.string),
};

export default Index;

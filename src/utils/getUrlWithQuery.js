import urlencode from 'urlencode';

export default ({ url, query }) => {
  const queryString = Object.keys(query).reduce(
    (accStr, param) => `${accStr}&${urlencode(param)}=${urlencode(query[param])}`,
    '',
  );
  return `${url}?${queryString}`;
};

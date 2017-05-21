import urlencode from 'urlencode';

export default ({ url, query }) => {
  const queryString = Object.entries(query).reduce(
    (accStr, [param, value]) => `${accStr}&${urlencode(param)}=${urlencode(value)}`,
    '',
  );
  return `${url}?${queryString}`;
};

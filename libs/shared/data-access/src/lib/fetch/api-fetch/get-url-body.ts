export const getUrlBody = <P>(
  reqUrl: string,
  method: 'GET' | 'POST',
  payload?: P | undefined,
) => {
  let url = reqUrl;

  if (method === 'GET' && Boolean(payload)) {
    url +=
      '?' + new URLSearchParams(payload as unknown as Record<string, string>);
  }

  const body = method === 'POST' ? JSON.stringify(payload) : undefined;

  return { url, body };
};

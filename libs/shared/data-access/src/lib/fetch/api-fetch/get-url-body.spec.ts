import { getUrlBody } from './get-url-body';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getUrlBody', () => {
  // Arrange
  const reqUrl = 'test-url';
  const searchText = 'test-search';
  const testParam = { search: searchText };
  const testPayload = { id: 'test-id' };

  test('get w/o param', () => {
    expect(getUrlBody(reqUrl, 'GET')).toStrictEqual({
      url: reqUrl,
      body: undefined,
    });
  });

  test('get w/ param', () => {
    expect(getUrlBody(reqUrl, 'GET', testParam)).toStrictEqual({
      url: reqUrl + '?search=test-search',
      body: undefined,
    });
  });

  test('post w/o payload', () => {
    expect(getUrlBody(reqUrl, 'POST')).toStrictEqual({
      url: reqUrl,
      body: undefined,
    });
  });

  test('post w/ payload', () => {
    expect(getUrlBody(reqUrl, 'POST', testPayload)).toStrictEqual({
      url: reqUrl,
      body: '{"id":"test-id"}',
    });
  });
});

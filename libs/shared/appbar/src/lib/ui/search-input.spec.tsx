import { render } from '@lihim/shared/testutils/ui';

import { SearchInput } from './search-input';

describe('SearchInput', () => {
  test('smoke', () => {
    render(<SearchInput />);
  });
});

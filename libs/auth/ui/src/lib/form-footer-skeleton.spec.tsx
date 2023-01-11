import { render } from '@lihim/shared/testutils/ui';

import { FormFooterSkeleton } from './form-footer-skeleton';

describe('FormFooterSkeleton', () => {
  test('render ok', () => {
    render(<FormFooterSkeleton />);
  });
});

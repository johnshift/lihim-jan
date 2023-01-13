import { AiOutlineHome } from 'react-icons/ai';

import { render, screen, user } from '@lihim/shared/testutils/ui';

import { NavItem } from './nav-item';

describe('NavItem', () => {
  // Setup
  const label = 'Test Label';

  test('defaults', () => {
    // Render component
    render(<NavItem label={label} icon={<AiOutlineHome />} />);

    // Assert
    expect(screen.getByText(label)).toBeVisible();
  });

  test('isActive', () => {
    // Render component
    render(<NavItem isActive label={label} icon={<AiOutlineHome />} />);

    // Assert
    expect(screen.getByText(label)).toBeVisible();
  });

  test('isDisabled', () => {
    // Render component
    render(<NavItem isDisabled label={label} icon={<AiOutlineHome />} />);

    // Assert
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('onClick', async () => {
    const onClick = jest.fn();

    // Render component
    render(
      <NavItem label={label} icon={<AiOutlineHome />} onClick={onClick} />,
    );

    // Click
    await user.click(screen.getByText(label));

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

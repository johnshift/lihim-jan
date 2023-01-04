import { FC, useReducer } from 'react';

import { Button } from '@mantine/core';

type Props = {
  text: string;
};

export const TestButton: FC<Props> = ({ text }) => {
  const [clicked, toggle] = useReducer((prev) => !prev, false);

  return (
    <div>
      <p data-testid="clicked-status">{clicked.toString()}</p>
      <Button onClick={toggle}>{text}</Button>
    </div>
  );
};

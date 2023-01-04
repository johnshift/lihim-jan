import { FC, MouseEventHandler, useReducer } from 'react';

import { Button } from '@mantine/core';

type Props = {
  text: string;
  onClick?: MouseEventHandler;
};

export const TestButton: FC<Props> = ({ text, onClick }) => {
  const [clicked, toggle] = useReducer((prev) => !prev, false);

  return (
    <div>
      <p data-testid="clicked-status">{clicked.toString()}</p>
      <Button onClick={toggle}>{text}</Button>
    </div>
  );
};

import { FC, MouseEventHandler } from 'react';

import { Button } from '@mantine/core';

type Props = {
  text: string;
  onClick?: MouseEventHandler;
};

export const TestButton: FC<Props> = ({ text, onClick }) => (
  <Button onClick={onClick}>{text}</Button>
);

import { useContext } from 'react';

import { RootCtx } from '../context/root-context';

export const useRootContext = () => useContext(RootCtx);

import { useState } from 'react';

export const useEmojiLoading = () => {
  const [loading, setLoading] = useState(true);
  const done = () => setLoading(false);

  return {
    loading,
    done,
  };
};

import {
  cleanNotifications,
  showNotification,
  updateNotification,
} from '@mantine/notifications';
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';

import crypto from 'node:crypto';

import { texts } from '@lihim/shared/core';

export const useNotify = () => {
  const id = crypto.randomUUID();

  // Loading notification
  const notifyLoading = (message: string) => {
    cleanNotifications();
    showNotification({
      id,
      color: 'blue',
      title: texts.loading,
      message,
      loading: true,
      autoClose: false,
      disallowClose: true,
    });
  };

  // Success notification
  const notifySuccess = (title: string, message: string) => {
    updateNotification({
      id,
      title,
      message,
      color: 'green',
      icon: <BsCheckCircle />,
      autoClose: 4000,
    });
  };

  // Error notification
  const notifyError = (title: string, message: string) => {
    updateNotification({
      id,
      title,
      message,
      color: 'red',
      icon: <BsExclamationCircle />,
      autoClose: 9000,
    });
  };

  return {
    id,
    notifyLoading,
    notifySuccess,
    notifyError,
  };
};

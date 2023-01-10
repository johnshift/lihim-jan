import {
  cleanNotifications,
  showNotification,
  updateNotification,
} from '@mantine/notifications';
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';

import { uid } from 'uid';

import { TEXT_LOADING } from '@lihim/shared/core';

const options = {
  success: {
    color: 'green',
    icon: <BsCheckCircle />,
    autoClose: 4000,
  },
  error: {
    color: 'red',
    icon: <BsExclamationCircle />,
    autoClose: 9000,
  },
};

export const useNotify = () => {
  const id = uid();

  // Loading notification
  const notifyLoading = (message: string) => {
    cleanNotifications();
    showNotification({
      id,
      color: 'blue',
      title: TEXT_LOADING,
      message,
      loading: true,
      autoClose: false,
      disallowClose: true,
    });
  };

  const notify = (title: string, message: string, isSuccess = true) => {
    updateNotification({
      id,
      title,
      message,
      ...(isSuccess ? options.success : options.error),
    });
  };

  // Success notification
  const notifySuccess = (title: string, message: string) => {
    notify(title, message);
  };

  // Error notification
  const notifyError = (title: string, message: string) => {
    notify(title, message, false);
  };

  return {
    id,
    notifyLoading,
    notifySuccess,
    notifyError,
  };
};

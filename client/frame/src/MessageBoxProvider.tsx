import React, { createContext, useState } from 'react';

type MessageProps = {
  severity: string,
  messageText: string,
};

type MessageContextType = {
  message: MessageProps,
  showMessage: (severity: string, messageText: string) => void
}

const defaultValue = {
  severity: '',
  messageText: '',
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const MessageBoxContext = createContext<MessageContextType>({ message: defaultValue, showMessage: function(severity: string, messageText: string) {} });

interface MessageBoxProviderProps {}

const MessageBoxProvider: React.FC<MessageBoxProviderProps> = ({ children }) => {
  const [message, setMessage] = useState<MessageProps>(defaultValue);

  const showMessage = (severity: string, messageText: string) => {
    setMessage({
      severity,
      messageText
    });
  };

  return (
    <MessageBoxContext.Provider value={{ message, showMessage }}>
      {children}
    </MessageBoxContext.Provider>
  );
};

export default MessageBoxProvider;
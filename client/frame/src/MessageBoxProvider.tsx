import React, { createContext, useState } from 'react';

export type MessageProps = {
  severity: string,
  messageText: string,
};

type MessageContextType = {
  messages: MessageProps[],
  showMessages: (messages: MessageProps[]) => void,
  removeMessage: (ind: number) => void
}

const defaultValue: MessageProps[] = [];

export const MessageBoxContext = createContext<MessageContextType>({
  messages: defaultValue,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showMessages: function(messages: MessageProps[]) {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  removeMessage: function(ind: number) {}
});

interface MessageBoxProviderProps {}

const MessageBoxProvider: React.FC<MessageBoxProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<MessageProps[]>(defaultValue);

  const showMessages = (messages: MessageProps[]) => {
    setMessages(messages.map(
      (message) => message
    ));

    setTimeout(() => {
      setMessages([]);
    }, 10000);

  };

  const removeMessage = (ind: number) => {
    setMessages(messages.filter((message, i) => i !== ind));
  };

  return (
    <MessageBoxContext.Provider value={{ messages, showMessages, removeMessage }}>
      {children}
    </MessageBoxContext.Provider>
  );
};

export default MessageBoxProvider;
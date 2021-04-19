import React, { useContext } from 'react';
import { MessageBoxContext } from '../MessageBoxProvider';

interface MessageBoxProps {}

const MessageBox: React.FC<MessageBoxProps> = () => {

  const { message } = useContext(MessageBoxContext);

  return (
    <div>
      <h1>{message.messageText}</h1>
    </div>
  );
};

export default MessageBox;
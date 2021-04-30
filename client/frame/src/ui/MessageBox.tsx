import React, { CSSProperties, useContext } from 'react';
import { MessageBoxContext, MessageProps } from '../MessageBoxProvider';
import { MessageBar, MessageBarType } from '@fluentui/react';

import '../animations.css';

interface MessageBoxProps {}

const MessageBox: React.FC<MessageBoxProps> = () => {
  const { messages, removeMessage } = useContext(MessageBoxContext);

  const getType = (msg: MessageProps) => {
    if (msg.severity === 'ERROR') {
      return MessageBarType.error;
    } else if (msg.severity === 'WARNING') {
      return MessageBarType.warning;
    } else if (msg.severity === 'INFO') {
      return MessageBarType.info;
    } else if (msg.severity === 'SUCCESS') {
      return MessageBarType.success;
    }
  };

  return (
    <div style={styles.messagesContainer}>
      {messages.map(
        (message, i) => (
          <MessageBar
            messageBarType={getType(message)}
            onDismiss={() => removeMessage(i)}
            className={message ? 'slide-up' : ''}
            key={`message-${i}`}
          >
            <div style={styles.message}>{message.messageText}</div>
          </MessageBar>
        )
      )}
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  messagesContainer: {
    bottom: 0,
    display: 'flex',
    flexDirection: 'column-reverse',
    position: 'absolute',
    right: '1vw',
  },
  message: {
    fontSize: '2em'
  }
};

export default MessageBox;
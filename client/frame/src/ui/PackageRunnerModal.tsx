import { IButtonStyles, IconButton, mergeStyleSets, Modal, PrimaryButton, Spinner, TextField } from '@fluentui/react';
import React, { CSSProperties, useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
import { MessageBoxContext, MessageProps } from '../MessageBoxProvider';
import ajax from '../utils/ajax';
import { PackageType } from '../views/PackageView';

interface PackageRunnerModalProps {
  isModalOpen: boolean,
  selectedPackageId: number|undefined,
  packages: PackageType[],
  setModalOpen: (value: boolean) => void,
}

const PackageRunnerModal: React.FC<PackageRunnerModalProps> = ({ isModalOpen, selectedPackageId, packages, setModalOpen }) => {
  const [isSending, setSending] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const history = useHistory();

  const [cookies, setCookies] = useCookies(['token']);
  const { showMessages } = useContext(MessageBoxContext);

  const runPackage = async () => {
    setSending(true);

    const result = await ajax.post(`packages/${selectedPackageId}/run`, {
      url
    }, cookies.token ? {
      headers: {
        Authorization: `Bearer ${cookies.token}`
      }
    } : undefined);

    setSending(false);

    if (result?.severity) {
      showMessages(result.messages.map(
        (message) => ({ severity: result.severity, messageText: message })
      ));
      return;
    }

    if (result.length) {
      const errorMessages = result.filter((r) => r.severity);
      const formattedMessages: MessageProps[] = [];
      errorMessages.forEach(
        (errMsg) => errMsg.messages.map(
          (msg) => {
            formattedMessages.push({ severity: errMsg.severity, messageText: msg });
          }
        )
      );

      showMessages(formattedMessages);
    }

    history.push(`/package/${selectedPackageId}`, result);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onDismiss={() => setModalOpen(false)}
      containerClassName={modalStyles.modal}
    >
      <div>
        <IconButton
          iconProps={{ iconName: 'Cancel' }}
          onClick={() => setModalOpen(false)}
          styles={closeIconStyles}
        />
      </div>
      {isSending ? <Spinner /> : null}
      <div style={{ textAlign: 'center' }}>
        <h1>{typeof selectedPackageId === 'number' && packages[selectedPackageId]?.name} futtatása</h1>
      </div>
      <span>Kérlek add meg az url-t, amit tesztelni szeretnél a csomaggal:</span>
      <TextField placeholder='url' onChange={(e) => setUrl(e.currentTarget.value)} />

      <div style={styles.footer}>
        <PrimaryButton text='Csomag futtatása' onClick={runPackage} />
      </div>

    </Modal>
  );
};

const closeIconStyles: Partial<IButtonStyles> = {
  root: {
    float: 'right'
  }
};

const modalStyles = mergeStyleSets({
  modal: {
    borderRadius: '15px',
    padding: '3vh',
  }
});

const styles: Record<string, CSSProperties> = {
  footer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: '2vh',
  }
};

export default PackageRunnerModal;
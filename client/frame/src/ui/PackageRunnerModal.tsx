import { IButtonStyles, IconButton, mergeStyleSets, Modal, PrimaryButton, Spinner, TextField } from '@fluentui/react';
import React, { CSSProperties, useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
import { MessageBoxContext } from '../MessageBoxProvider';
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
  const { showMessage } = useContext(MessageBoxContext);

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

    if (result?.severity || result[0].severity) {
      (result.messages || result[0].messages).forEach(
        (message) => showMessage(result.severity, message)
      );
      return;
    }

    history.push(`/package/${selectedPackageId}`, result);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onDismiss={() => setModalOpen(false)}
      containerClassName={modalStyles.modal}
    >
      <div className='header'>
        <IconButton
          iconProps={{ iconName: 'Cancel' }}
          onClick={() => setModalOpen(false)}
          styles={closeIconStyles}
        />
      </div>
      {isSending ? <Spinner /> : null}
      <h1>{typeof selectedPackageId === 'number' && packages[selectedPackageId]?.name} futtatása</h1>
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
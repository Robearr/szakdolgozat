import { DefaultButton, FocusZone, FocusZoneDirection, IconButton, Link, List, Modal, PrimaryButton, Spinner, TextField } from '@fluentui/react';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MessageBoxContext } from '../MessageBoxProvider';
import ajax, { PackagesResponseType } from '../utils/ajax';
import { PackageType } from './PackageView';

interface PackagesProps {}

const PackagesView: React.FC<PackagesProps> = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isSending, setSending] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedPackageId, setSelectedPackageId] = useState<number>();
  const [url, setUrl] = useState<string>('');
  const { showMessage } = useContext(MessageBoxContext);

  useEffect(() => {
    (async () => {
      const pckgs: PackagesResponseType = await ajax.get('packages');

      if (pckgs.severity) {
        pckgs.messages.forEach(
          (message: string) => showMessage(pckgs.severity, message)
        );
        return;
      }

      setPackages(pckgs);
      setLoading(false);
    })();
  }, []);

  const selectPackageToRun = (index: number|undefined) => {

    if (index === 0 || index) {
      setSelectedPackageId(index);
      setModalOpen(true);
    }
  };

  const onRenderCell = (pckg: PackageType|undefined, index: number|undefined): ReactNode => {
    return (
      <div>
        <Link><NavLink to={`/package/${index}`}>{pckg?.name}</NavLink></Link>
        <span>{pckg?.description}</span>

        <DefaultButton text='Teszt futtatása' onClick={() => selectPackageToRun(index)}/>
      </div>
    );
  };

  const runPackage = async () => {
    setSending(true);

    const result = await ajax.post(`packages/${selectedPackageId}/run`, {
      url
    });

    setSending(false);

    if (result?.severity) {
      result.messages.forEach(
        (message) => showMessage(result.severity, message)
      );
      return;
    }

    // TODO át kellene navigálni a PackageView-ba az eredménnyel
  };

  return (
    <div>
      {isLoading ? <Spinner /> : null}
      <FocusZone direction={FocusZoneDirection.vertical}>
        <List items={packages} onRenderCell={onRenderCell}/>
      </FocusZone>

      <Modal
        isOpen={isModalOpen}
        onDismiss={() => setModalOpen(false)}
      >
        {isSending ? <Spinner /> : null}
        <h1>{typeof selectedPackageId === 'number' && packages[selectedPackageId]?.name} futtatása</h1>
        <span>Kérlek add meg az url-t, amit tesztelni szeretnél a csomaggal:</span>
        <TextField label='url' onChange={(e) => setUrl(e.currentTarget.value)} />
        <PrimaryButton text='Csomag futtatása' onClick={runPackage}/>

        <IconButton
          iconProps={{ iconName: 'Cancel' }}
          onClick={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default PackagesView;
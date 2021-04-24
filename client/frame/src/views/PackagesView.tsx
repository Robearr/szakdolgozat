import { FocusZone, FocusZoneDirection, List, Spinner } from '@fluentui/react';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { MessageBoxContext } from '../MessageBoxProvider';
import PackageListItem from '../ui/PackageListItem';
import PackageRunnerModal from '../ui/PackageRunnerModal';
import ajax, { PackagesResponseType } from '../utils/ajax';
import { PackageType } from './PackageView';

interface PackagesProps {}

const PackagesView: React.FC<PackagesProps> = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedPackageId, setSelectedPackageId] = useState<number>();
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
      <PackageListItem pckg={pckg} index={index} selectPackageToRun={selectPackageToRun} />
    );
  };


  return (
    <div>
      {isLoading ? <Spinner /> : null}
      <FocusZone direction={FocusZoneDirection.vertical}>
        <List items={packages} onRenderCell={onRenderCell}/>
      </FocusZone>

      <PackageRunnerModal
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        packages={packages}
        selectedPackageId={selectedPackageId}
      />

    </div>
  );
};

export default PackagesView;
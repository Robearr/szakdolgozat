import { FocusZone, FocusZoneDirection, Spinner, Stack } from '@fluentui/react';
import React, { CSSProperties, useContext, useEffect, useState } from 'react';
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
  const { showMessages } = useContext(MessageBoxContext);

  useEffect(() => {
    (async () => {
      const pckgs: PackagesResponseType = await ajax.get('packages');

      if (pckgs.severity) {
        showMessages(pckgs.messages.map(
          (message) => ({ severity: pckgs.severity, messageText: message })
        ));
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

  return (
    <div>
      {isLoading ? <Spinner /> : null}
      <FocusZone direction={FocusZoneDirection.vertical}>

        <Stack style={styles.container}>
          {packages.map(
            (pckg, i) => (
              <Stack key={`package-${i}`} style={styles.item}>
                <PackageListItem
                  pckg={pckg}
                  index={i}
                  selectPackageToRun={selectPackageToRun}
                  packageDataOptions={{ isNameLink: true }}
                />
              </Stack>
            )
          )}
        </Stack>
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

const styles: Record<string, CSSProperties> = {
  container: {
    columnCount: 3,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  item: {
    width: '28vw'
  }
};

export default PackagesView;
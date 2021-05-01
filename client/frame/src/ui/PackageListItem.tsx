import { Stack } from '@fluentui/react';
import React, { CSSProperties } from 'react';
import { PackageType } from '../views/PackageView';
import PackageData from './PackageData';

interface PackageListItemProps {
  index: number|undefined,
  pckg: PackageType|undefined,
  selectPackageToRun: (index: number|undefined) => void,
  packageDataOptions?: {
    withoutTests?: boolean,
    isNameLink?: boolean
  }
}

const PackageListItem: React.FC<PackageListItemProps> = ({ pckg, index, selectPackageToRun, packageDataOptions }) => {
  return (
    <Stack style={styles.item}>
      <PackageData pckg={pckg} index={index} options={packageDataOptions} selectPackageToRun={selectPackageToRun} />
    </Stack>
  );
};

const styles: Record<string, CSSProperties> = {
  item: {
    marginBottom: '1vh',
    padding: '1vh',
  },
  centeredFlex: {
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default PackageListItem;

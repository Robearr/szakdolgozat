import { DefaultButton, Stack } from '@fluentui/react';
import React, { CSSProperties } from 'react';
import { useCookies } from 'react-cookie';
import runnerButtonDisabledProps from '../utils/runnerButtonDisabledProps';
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
  const [cookies, setCookies] = useCookies(['token']);

  return (
    <Stack style={styles.item}>
      <PackageData pckg={pckg} index={index} options={packageDataOptions}/>

      <DefaultButton
        text='Teszt futtatása'
        title={runnerButtonDisabledProps.getDisabledMessage(pckg, cookies.token)}
        style={{ width: '10vw' }}
        onClick={() => selectPackageToRun(index)}
        disabled={runnerButtonDisabledProps.isDisabled(pckg, cookies.token)}
      />

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

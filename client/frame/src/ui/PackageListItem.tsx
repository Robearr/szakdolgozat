import { DefaultButton, Separator, Stack } from '@fluentui/react';
import React, { CSSProperties } from 'react';
import { useCookies } from 'react-cookie';
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

  const getDisabledMessage = () => {
    if (pckg?.needsAuth && !cookies.token) {
      return 'A futtatáshoz be kell lépni!';
    }
    if (!pckg?.isActive) {
      return 'A csomag nincsen aktiválva!';
    }
    // TODO: dátum ellenőrzése

    return 'Teszt futtatása';
  };

  const isDisabled = (pckg?.needsAuth && !cookies.token) || !pckg?.isActive;

  return (
    <Stack style={styles.item}>
      <PackageData pckg={pckg} index={index} options={packageDataOptions}/>

      <DefaultButton
        text='Teszt futtatása'
        title={getDisabledMessage()}
        style={{ width: '10vw' }}
        onClick={() => selectPackageToRun(index)}
        disabled={isDisabled}
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

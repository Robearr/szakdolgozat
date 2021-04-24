import { DefaultButton, Link, NeutralColors } from '@fluentui/react';
import React, { CSSProperties } from 'react';
import { useCookies } from 'react-cookie';
import { NavLink } from 'react-router-dom';
import { PackageType } from '../views/PackageView';

interface PackageListItemProps {
  index: number|undefined,
  pckg: PackageType|undefined,
  selectPackageToRun: (index: number|undefined) => void
}

const PackageListItem: React.FC<PackageListItemProps> = ({ pckg, index, selectPackageToRun }) => {
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
    <div style={styles.item}>
      <Link style={styles.name}><NavLink to={`/package/${index}`}>{pckg?.name}</NavLink></Link>
      <p className='description'>{pckg?.description}</p>

      <p style={{ backgroundColor: pckg?.isActive ? '#107c10' : '#a80000' }}>{pckg?.isActive ? 'Aktív' : 'Nem elérhető'}</p>
      <p>Elérhető: {pckg?.availableFrom} - {pckg?.availableTo}</p>

      <p>{pckg?.ipMask ? 'Van' : 'Nincs'} IP mask</p>
      <p>{pckg?.urlMask ? 'Van' : 'Nincs'} URL mask</p>

      <p>Maximum futási idő: {pckg?.timeout} ms</p>
      <p>Tesztek száma: {pckg?.tests.length}</p>

      <DefaultButton
        text='Teszt futtatása'
        title={getDisabledMessage()}
        onClick={() => selectPackageToRun(index)}
        disabled={isDisabled}
      />
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  item: {
    backgroundColor: NeutralColors.gray30,
    marginBottom: '1vh',
    width: '85vw'
  },
  name: {
    fontVariant: 'small-caps'
  }
};

export default PackageListItem;

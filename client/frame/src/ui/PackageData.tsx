import { Link, Stack } from '@fluentui/react';
import React, { CSSProperties } from 'react';
import { NavLink } from 'react-router-dom';
import { PackageType } from '../views/PackageView';

interface PackageDataProps {
  pckg: PackageType|undefined,
  index: number|undefined,
  withoutTests?: boolean
}

const PackageData: React.FC<PackageDataProps> = ({ pckg, index, withoutTests }) => {
  return (
    <Stack>
      <Stack>
        <h1 style={styles.name}><Link><NavLink to={`/package/${index}`}>{pckg?.name}</NavLink></Link></h1>
        <h3>{pckg?.description}</h3>
      </Stack>

      <p style={{ backgroundColor: pckg?.isActive ? '#107c10' : '#a80000' }}>{pckg?.isActive ? 'Aktív' : 'Nem elérhető'}</p>
      <p>Elérhető: {pckg?.availableFrom} - {pckg?.availableTo}</p>

      <p>{pckg?.ipMask ? 'Van' : 'Nincs'} IP mask</p>
      <p>{pckg?.urlMask ? 'Van' : 'Nincs'} URL mask</p>

      <p>Maximum futási idő: {pckg?.timeout} ms</p>

      {withoutTests ?
        null :
        <p>Tesztek száma: {pckg?.tests.length}</p>
      }
    </Stack>
  );
};

const styles: Record<string, CSSProperties> = {
  name: {
    fontVariant: 'small-caps',
    margin: 0,
  }
};

export default PackageData;
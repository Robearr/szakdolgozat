import { Link, Stack } from '@fluentui/react';
import React, { CSSProperties } from 'react';
import { NavLink } from 'react-router-dom';
import { PackageType } from '../views/PackageView';

interface PackageDataProps {
  pckg: PackageType|undefined,
  index: number|undefined,
  options? : {
    withoutTests?: boolean,
    isNameLink?: boolean
  }
}

const PackageData: React.FC<PackageDataProps> = ({ pckg, index, options }) => {
  return (
    <Stack>
      <Stack>
        <h1 style={styles.name}>
          {options?.isNameLink ?
            <Link>
              <NavLink to={`/package/${index}`}>{pckg?.name}</NavLink>
            </Link> :
            <span>{pckg?.name}</span>
          }
        </h1>
        <h3>{pckg?.description}</h3>
      </Stack>

      <p style={{ backgroundColor: pckg?.isActive ? '#107c10' : '#a80000' }}>{pckg?.isActive ? 'Aktív' : 'Nem elérhető'}</p>
      <p>Elérhető: {pckg?.availableFrom} - {pckg?.availableTo}</p>

      <p>{pckg?.ipMask ? 'Van' : 'Nincs'} IP mask</p>
      <p>{pckg?.urlMask ? 'Van' : 'Nincs'} URL mask</p>

      <p>Maximum futási idő: {pckg?.timeout} ms</p>

      {options?.withoutTests ?
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
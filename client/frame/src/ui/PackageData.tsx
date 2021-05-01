import { Link, Stack, Text } from '@fluentui/react';
import dayjs from 'dayjs';
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

  const isAvailable = () => {
    return dayjs(pckg?.availableFrom).isBefore(dayjs()) && dayjs(pckg?.availableTo).isAfter(dayjs());
  };

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
      <Stack>
        <Text style={{ backgroundColor: pckg?.isActive ? '#107c10' : '#a80000', ...styles.status }}>{pckg?.isActive ? 'Aktív' : 'Nem elérhető'}</Text>
        <Text style={{ backgroundColor: isAvailable() ? '#107c10' : '#a80000', ...styles.status }}>
          Intervallum: {pckg?.availableFrom} - {pckg?.availableTo}
        </Text>

        <Text>{pckg?.ipMask ? 'Van' : 'Nincs'} IP mask</Text>
        <Text>{pckg?.urlMask ? 'Van' : 'Nincs'} URL mask</Text>

        <Text>Maximum futási idő: {pckg?.timeout} ms</Text>

        {options?.withoutTests ?
          null :
          <Text>Tesztek száma: {pckg?.tests.length}</Text>
        }
      </Stack>
    </Stack>
  );
};

const styles: Record<string, CSSProperties> = {
  name: {
    fontVariant: 'small-caps',
    margin: 0,
  },
  status: {
    color: 'white',
    textAlign: 'center',
    width: '20vw',
  }
};

export default PackageData;
import { DefaultButton, Link, Stack, Text } from '@fluentui/react';
import dayjs from 'dayjs';
import React, { CSSProperties } from 'react';
import { useCookies } from 'react-cookie';
import { NavLink } from 'react-router-dom';
import runnerButtonDisabledProps from '../utils/runnerButtonDisabledProps';
import { PackageType } from '../views/PackageView';
import Card from './Card';

interface PackageDataProps {
  pckg: PackageType|undefined,
  index: number|undefined,
  selectPackageToRun?: (index: number|undefined) => void,
  options? : {
    withoutTests?: boolean,
    isNameLink?: boolean
  },
}

const PackageData: React.FC<PackageDataProps> = ({ pckg, index, selectPackageToRun, options }) => {
  const [cookies, setCookies] = useCookies(['token']);

  const isAvailable = () => {
    return dayjs(pckg?.availableFrom).isBefore(dayjs()) && dayjs(pckg?.availableTo).isAfter(dayjs());
  };

  return (
    <Card>
      <Card.Header>
        <h1 style={styles.name}>
          {options?.isNameLink ?
            <Link>
              <NavLink to={`/package/${index}`}>{pckg?.name}</NavLink>
            </Link> :
            <span>{pckg?.name}</span>
          }
        </h1>
        <h3>{pckg?.description}</h3>
      </Card.Header>
      <Card.Body>
        <Stack style={styles.center}>
          <Stack><Text style={{ backgroundColor: pckg?.isActive ? '#107c10' : '#a80000', ...styles.status }}>{pckg?.isActive ? 'Aktiválva van!' : 'Jelenleg nem elérhető!'}</Text></Stack>
          <Stack>
            <Text style={{ backgroundColor: isAvailable() ? '#107c10' : '#a80000', ...styles.status }}>
              Intervallum: {pckg?.availableFrom} - {pckg?.availableTo}
            </Text>
          </Stack>

          <Stack style={{ ...styles.center, marginTop: '2vh' }}>
            <Stack><Text>{pckg?.ipMask ? 'Van' : 'Nincs'} IP mask</Text></Stack>
            <Stack><Text>{pckg?.urlMask ? 'Van' : 'Nincs'} URL mask</Text></Stack>

            <Stack><Text>Maximum futási idő: {pckg?.timeout} ms</Text></Stack>

            {options?.withoutTests ?
              null :
              <Stack><Text>Tesztek száma: {pckg?.tests.length}</Text></Stack>
            }
          </Stack>

        </Stack>
      </Card.Body>
      {selectPackageToRun ?
        <Card.Footer>
          <Stack style={{ alignItems: 'center', marginTop: '2vh' }}>
            <DefaultButton
              text='Teszt futtatása'
              title={runnerButtonDisabledProps.getDisabledMessage(pckg, cookies.token)}
              style={{ width: '10vw' }}
              onClick={() => selectPackageToRun(index)}
              disabled={runnerButtonDisabledProps.isDisabled(pckg, cookies.token)}
            />
          </Stack>
        </Card.Footer> :
        null
      }
    </Card>
  );
};

const styles: Record<string, CSSProperties> = {
  name: {
    fontVariant: 'small-caps',
    margin: 0,
  },
  status: {
    borderRadius: '15px',
    color: 'white',
    minWidth: '3vw',
    textAlign: 'center',
    marginTop: '1vh',
    padding: '1vh'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default PackageData;
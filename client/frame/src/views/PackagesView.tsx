import { DetailsList, IColumn, IGroup, Spinner } from '@fluentui/react';
import React, { useContext, useEffect, useState } from 'react';
import { MessageBoxContext } from '../MessageBoxProvider';
import ajax from '../utils/ajax';

export type TestType = {
  name: string,
  timeout: number,
  customErrorMessage?: string,
  isCustomErrorMessageVisible?: boolean,
  isErrorDescriptionVisible?: boolean,
  isStackVisible?: boolean,
  points: number,
  packageId: number,
  callbackPath: string
};

export type PackageType = {
  name: string,
  description: string,
  isActive: boolean,
  availableFrom: Date,
  availableTo: Date,
  needsAuth: boolean,
  ipMask?: string,
  urlMask?: string,
  timeout: number,
  tests: TestType[]
};

type TestItemType = {
  name: string,
  points: number
};

interface PackagesProps {}

const PackagesView: React.FC<PackagesProps> = () => {

  const [testNames, setTestNames] = useState<TestItemType[]>([]);
  const [groups, setGroups] = useState<IGroup[]>();
  const { showMessage } = useContext(MessageBoxContext);

  useEffect(() => {
    (async () => {
      const pckgs = await ajax.get('packages');

      if (pckgs.severity) {
        pckgs.messages.forEach(
          (message) => showMessage(pckgs.severity, message)
        );
        return;
      }

      setGroups(pckgs.map(
        (res, i) => {
          const startIndex = i - 1 < 0 ? 0 : pckgs[i - 1].tests.length;
          console.log(startIndex);

          return { key: `${res}-${i}`, name: res.name, startIndex, count: pckgs[i].tests?.length || 0, level: 0 };
        }
      ));

      const tests = await ajax.get('tests');

      if (tests.severity) {
        tests.messages.forEach(
          (message) => showMessage(tests.severity, message)
        );
        return;
      }

      setTestNames(tests.map(
        (test: TestType) => ({
          name: test.name,
          points: test.points,
          timeout: test.timeout
        })
      ));

    })();
  }, []);

  const columns: IColumn[] = [
    { key: 'name', name: 'név', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'points', name: 'pontok', fieldName: 'points', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'timeout', name: 'timeout', fieldName: 'timeout', minWidth: 100, maxWidth: 200, isResizable: true },
  ];

  return (
    <div className=''>
      {testNames?.length ?
        <DetailsList
          items={testNames}
          groups={groups}
          columns={columns}
        /> :
        <Spinner />
      }
    </div>
  );
};

export default PackagesView;
import { ActionButton, DetailsList, IColumn, IGroup, MarqueeSelection, Selection, SelectionMode, Spinner, TextField } from '@fluentui/react';
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

  const [tests, setTests] = useState<TestType[]>([]);
  const [testNames, setTestNames] = useState<TestItemType[]>([]);
  const [groups, setGroups] = useState<IGroup[]>();
  const [url, setUrl] = useState<string>('');
  const [selection] = useState<Selection>(new Selection());
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
          return { key: `${res}-${i}`, name: res.name, startIndex, count: pckgs[i].tests?.length || 0, level: 0 };
        }
      ));

      const result = await ajax.get('tests');

      if (result.severity) {
        result.messages.forEach(
          (message) => showMessage(result.severity, message)
        );
        return;
      }

      setTestNames(result.map(
        (test: TestType) => ({
          name: test.name,
          points: test.points,
          timeout: test.timeout
        })
      ));

      setTests(result);

    })();
  }, []);

  const columns: IColumn[] = [
    { key: 'name', name: 'név', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'points', name: 'pontok', fieldName: 'points', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'timeout', name: 'timeout', fieldName: 'timeout', minWidth: 100, maxWidth: 200, isResizable: true },
  ];

  const runTests = () => {
    const runnableTests = selection.getSelectedIndices().map(
      (i) => ({ [tests[i].packageId]: i })
    );

    const map = new Map();

    runnableTests.forEach(
      (test: Record<string, number>) => {
        const key = Object.keys(test)[0];
        if (!map.get(key)) {
          map.set(key, [test[key]]);
        } else {
          map.get(key).push(test[key]);
        }
      }
    );

    Array.from(map.keys()).forEach(
      (key) => {
        ajax.post(`packages/${key - 1}/run`, {
          tests: map.get(key),
          url
        });
      }
    );

  };

  if (!testNames?.length) {
    return <Spinner />;
  }

  return (
    <div className=''>
      <MarqueeSelection selection={selection}>
        <DetailsList
          items={testNames}
          groups={groups}
          columns={columns}
          selection={selection}
          selectionMode={SelectionMode.multiple}
        />
      </MarqueeSelection>

      <TextField label='Tesztelendő url' onChange={(e) => setUrl(e.currentTarget.value)}/>
      <ActionButton text='Tesztelés' onClick={runTests} />

    </div>
  );
};

export default PackagesView;
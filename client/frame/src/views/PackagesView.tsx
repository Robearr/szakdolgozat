import { ActionButton, DetailsList, IColumn, IGroup, MarqueeSelection, Selection, SelectionMode, Spinner, TextField } from '@fluentui/react';
import React, { useContext, useEffect, useState } from 'react';
import { MessageBoxContext } from '../MessageBoxProvider';
import ajax, { ResultResponseType } from '../utils/ajax';

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
  points: number,
  result?: number,
  customErrorMessage?: string,
  errorDescription?: string,
  stack?: string
};

interface PackagesProps {}

const PackagesView: React.FC<PackagesProps> = () => {

  const [tests, setTests] = useState<TestType[]>([]);
  const [testDatas, setTestDatas] = useState<TestItemType[]>([]);
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

      setTestDatas(result.map(
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
    { key: 'name', name: 'Név', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'timeout', name: 'Timeout', fieldName: 'timeout', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'points', name: 'Pontszám', fieldName: 'points', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'result', name: 'Eredmény', fieldName: 'result', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'customErrorMessage', name: 'Hibaüzenet', fieldName: 'customErrorMessage', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'errorDescription', name: 'Hiba leírása', fieldName: 'errorDescription', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'stack', name: 'Stack trace', fieldName: 'stack', minWidth: 100, maxWidth: 200, isResizable: true },
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
      async (key) => {

        // az id nélküli tárolás miatt valahogy meg kell tartani a normális indexelést, ezért
        // itt történik a normalizálás
        let normalizedTests = map.get(key);

        if (key > 0 && groups) {
          for (let i = 0; i < key - 1; i++) {
            normalizedTests = map.get(key).map(
              (testId: number) => testId -= groups[i].count
            );
          }
        }

        const results: ResultResponseType = await ajax.post(`packages/${key - 1}/run`, {
          tests: normalizedTests,
          url
        });

        if (results.severity) {
          results.messages.forEach(
            (message) => showMessage(results.severity, message)
          );
          return;
        }

        const testDataCopies = [...testDatas];

        map.get(key).forEach(
          (dataIndex: number, i: number) => {
            testDataCopies[dataIndex] = {
              ...testDataCopies[dataIndex],
              ...results[i],
              result: results[i].points
            };
          }
        );

        setTestDatas(testDataCopies);
      }
    );

  };

  if (!testDatas?.length) {
    return <Spinner />;
  }

  return (
    <div className=''>
      <MarqueeSelection selection={selection}>
        <DetailsList
          items={testDatas}
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
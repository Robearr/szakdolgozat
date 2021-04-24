import { ActionButton, DetailsList, IColumn, MarqueeSelection, Selection, SelectionMode, Spinner, Stack, TextField } from '@fluentui/react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { MessageBoxContext } from '../MessageBoxProvider';
import ajax from '../utils/ajax';

interface PackageViewProps {}

interface ParamsProps {
  id: string
}

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

type TestItemType = {
  name: string,
  points: number,
  result?: number,
  customErrorMessage?: string,
  errorDescription?: string,
  stack?: string
};

const PackageView: React.FC<PackageViewProps> = () => {
  const [pckg, setPckg] = useState<PackageType>();
  const [tests, setTests] = useState<TestItemType[]>([]);
  const [url, setUrl] = useState<string>('');
  const [selection] = useState<Selection>(new Selection());
  const [isLoading, setLoading] = useState<boolean>(true);

  const params = useParams<ParamsProps>();
  const { showMessage } = useContext(MessageBoxContext);

  useEffect(() => {
    (async () => {
      const result = await ajax.get(`packages/${params.id}`);

      if (result.severity) {
        result.messages.forEach(
          (message: string) => showMessage(result.severity, message)
        );
        return;
      }

      setPckg(result);
      setTests(result.tests.map(
        (test) => {
          test.customErrorMessage = '';
          return test;
        }
      ));

      setLoading(false);
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

  const runTests = async () => {
    setLoading(true);
    const selectedIndices = selection.getSelectedIndices();
    const result = await ajax.post(`packages/${params.id}/run`, {
      url,
      tests: selectedIndices
    });
    setLoading(false);

    if (result.severity) {
      result.messages.forEach(
        (message: string) => showMessage(result.severity, message)
      );
      return;
    }

    const testsCopy = [...tests];

    selectedIndices.forEach(
      (selectedIndex: number, i: number) => {
        const gotPoints = result[i].points;
        delete result[i].points;
        testsCopy[selectedIndex] = {
          ...testsCopy[selectedIndex],
          ...result[i],
          result: gotPoints
        };
      }
    );

    setTests(testsCopy);
  };

  return (
    <Stack>
      <h1>{pckg?.name}</h1>
      <h2>{pckg?.description}</h2>
      <h3>{pckg?.availableFrom} - {pckg?.availableTo}</h3>
      <h3>{pckg?.ipMask}</h3>
      <h3>{pckg?.urlMask}</h3>
      <h3>{pckg?.isActive}</h3>
      <h3>{pckg?.needsAuth}</h3>
      <h3>{pckg?.timeout}</h3>

      {isLoading ? <Spinner /> : null}

      <MarqueeSelection selection={selection}>
        <DetailsList
          items={tests}
          columns={columns}
          selection={selection}
          selectionMode={SelectionMode.multiple}
        />
      </MarqueeSelection>

      <TextField label='Tesztelendő url' onChange={(e) => setUrl(e.currentTarget.value)}/>
      <ActionButton text='Tesztelés' onClick={runTests} />

    </Stack>
  );
};

export default PackageView;
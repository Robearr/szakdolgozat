import { DefaultButton, DetailsList, IColumn, Selection, SelectionMode, Spinner, Stack, TextField } from '@fluentui/react';
import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { MessageBoxContext } from '../MessageBoxProvider';
import PackageData from '../ui/PackageData';
import ajax, { ResultResponseType } from '../utils/ajax';

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
      setLoading(false);

      if (history.state?.state) {
        setTests(history.state.state.map(
          (testResult: ResultResponseType, i: number) => {
            const tmp = Object.assign({}, testResult);
            const gotPoints = tmp.points;
            delete tmp.points;

            return {
              ...result.tests[i],
              ...testResult,
              result: gotPoints
            };
          }
        ));
        return;
      }

      setTests(result.tests.map(
        (test) => {
          test.customErrorMessage = '';
          return test;
        }
      ));

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
      <PackageData pckg={pckg} index={parseInt(params.id)} options={{ withoutTests: true }} />

      {isLoading ? <Spinner /> : null}

      <DetailsList
        items={tests}
        columns={columns}
        selection={selection}
        selectionMode={SelectionMode.multiple}
      />

      <Stack style={styles.footer}>
        <TextField label='Tesztelendő url' style={{ width: '30vw' }} onChange={(e) => setUrl(e.currentTarget.value)}/>
        <DefaultButton text='Tesztelés' style={{ width: '10vw' }} onClick={runTests} />
      </Stack>

    </Stack>
  );
};

const styles: Record<string, CSSProperties> = {
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default PackageView;
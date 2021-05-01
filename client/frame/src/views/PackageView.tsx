import { DefaultButton, DetailsList, DetailsRow, IColumn, IDetailsRowProps, IRenderFunction, Selection, SelectionMode, Spinner, Stack, TextField } from '@fluentui/react';
import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router';
import { MessageBoxContext } from '../MessageBoxProvider';
import PackageData from '../ui/PackageData';
import ajax, { ResultResponseType } from '../utils/ajax';
import runnerButtonDisabledProps from '../utils/runnerButtonDisabledProps';

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
  const [cookies, setCookies] = useCookies(['token']);
  const { showMessages } = useContext(MessageBoxContext);

  useEffect(() => {
    (async () => {
      const result = await ajax.get(`packages/${params.id}`);

      if (result.severity) {
        showMessages(result.messages.map(
          (message) => ({ severity: result.severity, messageText: message })
        ));
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

            const originalTest = result.tests[i];
            delete originalTest.customErrorMessage;

            return {
              ...originalTest,
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
    }, cookies.token ? {
      headers: {
        Authorization: `Bearer ${cookies.token}`
      }
    } : undefined);
    setLoading(false);

    if (result.severity) {
      showMessages(result.messages.map(
        (message) => ({ severity: result.severity, messageText: message })
      ));
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

  const onRenderRow = (props: IDetailsRowProps): JSX.Element => {
    let backgroundColor;

    if (props.item.result === 0) {
      backgroundColor = '#a80000';
    } else if (props.item.result) {
      console.log(props.item.result);
      backgroundColor = '#107c10';
    }

    return <DetailsRow { ...props } styles={{ root: { backgroundColor, color: backgroundColor ? 'white' : 'black' } }}/>;
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
        onRenderRow={onRenderRow as IRenderFunction<IDetailsRowProps>}
      />

      <Stack style={styles.footer}>
        <TextField label='Tesztelendő url' style={{ width: '30vw' }} onChange={(e) => setUrl(e.currentTarget.value)}/>
        <DefaultButton
          text='Tesztelés'
          title={runnerButtonDisabledProps.getDisabledMessage(pckg, cookies.token)}
          style={{ width: '10vw' }}
          disabled={runnerButtonDisabledProps.isDisabled(pckg, cookies.token)}
          onClick={runTests}
        />
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
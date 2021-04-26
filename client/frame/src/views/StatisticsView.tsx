import { Stack } from '@fluentui/react';
import { ChartData } from 'chart.js';
import { reject, uniqBy } from 'lodash';
import React, { CSSProperties, useContext, useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useCookies } from 'react-cookie';
import { MessageBoxContext } from '../MessageBoxProvider';
import ajax, { StatisticResponseType } from '../utils/ajax';

interface StatisticsProps {}

export type StatisticType = {
  result: number,
  userId: number|null,
  testId: number|null,
  packageId: number|null,
  createdAt: Date
};

const StatisticsView: React.FC<StatisticsProps> = () => {
  const [cookies, setCookies] = useCookies(['token']);
  const [statistics, setStatistics] = useState<StatisticResponseType>();

  const { showMessage } = useContext(MessageBoxContext);

  useEffect(() => {
    (async () => {
      const result = await ajax.get('statistics', {
        headers: {
          Authorization: `Bearer ${cookies.token}`
        }
      });

      if (result.severity) {
        result.messages.forEach(
          (message: string) => showMessage(result.severity, message)
        );
        return;
      }

      setStatistics(result);

    })();
  }, []);

  const createLoggedInData = (prop: keyof StatisticType): ChartData => {
    const uniqValues = reject(uniqBy(statistics?.loggedIn, prop), (s) => s[prop] === null);

    const datasets = uniqValues.map(
      (value) => ({
        data: [value.result],
        label: `${value[prop]}`
      })
    );

    return {
      labels: uniqValues.map((value) => value[prop]),
      datasets
    };

  };

  const createNotLoggedInData = (prop: keyof StatisticType): ChartData => {
    const uniqValues = reject(uniqBy(statistics?.notLoggedIn, prop), (s) => s[prop] === null);

    const datasets = statistics?.notLoggedIn?.map(
      (value) => ({
        data: [value.result],
        label: `${value[prop]}`
      })
    );


    return {
      labels: uniqValues.map((value) => value[prop]),
      datasets: datasets || []
    };
  };

  const loggedInPackageData = useMemo<ChartData>(() => createLoggedInData('packageId'), [statistics]);
  const loggedInTestData = useMemo<ChartData>(() => createLoggedInData('testId'), [statistics]);

  const notLoggedInPackageData = useMemo<ChartData>(() => createNotLoggedInData('packageId'), [statistics]);
  const notLoggedInTestData = useMemo<ChartData>(() => createNotLoggedInData('testId'), [statistics]);

  return (
    <Stack>
      <h1>Belépett felhasználók</h1>
      <div>
        <div style={styles.chart}>
          <h2>Futtatott csomagok eredményei</h2>
          <Bar type='bar' data={loggedInPackageData} options={{ plugins: { legend: { display: false } } }}/>
        </div>

        <div style={styles.chart}>
          <h2>Futtatott tesztek eredményei</h2>
          <Bar type='bar' data={loggedInTestData} options={{ plugins: { legend: { display: false } } }}/>
        </div>
      </div>

      <h1>Nem belépett felhasználók</h1>
      <div>
        <div style={styles.chart}>
          <h2>Futtatott csomagok eredményei</h2>
          <Bar type='bar' data={notLoggedInTestData} options={{ plugins: { legend: { display: false } } }}/>
        </div>
        <div style={styles.chart}>
          <h2>Futtatott tesztek eredményei</h2>
          <Bar type='bar' data={notLoggedInPackageData} options={{ plugins: { legend: { display: false } } }}/>
        </div>
      </div>
    </Stack>
  );
};

const styles: Record<string, CSSProperties> = {
  chart: {
    float: 'left',
    padding: '2%',
    width: '45%'
  }
};

export default StatisticsView;
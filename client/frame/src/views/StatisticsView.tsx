import { Stack } from '@fluentui/react';
import { ChartData } from 'chart.js';
import { max, reject, uniqBy } from 'lodash';
import React, { CSSProperties, useContext, useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useCookies } from 'react-cookie';
import { MessageBoxContext } from '../MessageBoxProvider';
import ajax, { StatisticResponseType } from '../utils/ajax';
import colors from '../utils/colors';

interface StatisticsProps {}

export type StatisticType = {
  result: number,
  userId: number|null,
  userName: string|null,
  testId: number|null,
  packageId: number|null,
  createdAt: Date
};

const StatisticsView: React.FC<StatisticsProps> = () => {
  const [cookies, setCookies] = useCookies(['token']);
  const [statistics, setStatistics] = useState<StatisticResponseType>();

  const { showMessages } = useContext(MessageBoxContext);

  useEffect(() => {
    (async () => {
      const result = await ajax.get('statistics', {
        headers: {
          Authorization: `Bearer ${cookies.token}`
        }
      });

      if (result.severity) {
        showMessages(result.messages.map(
          (message) => ({ severity: result.severity, messageText: message })
        ));
        return;
      }

      setStatistics(result);

    })();
  }, []);

  const createLoggedInData = (prop: keyof StatisticType): ChartData => {
    const users = uniqBy(statistics?.loggedIn, 'userId');
    const neededProps: string[] = [];

    const values = users.map(
      (user) => statistics?.loggedIn.filter(
        (statistic) => statistic.userId === user.userId
      ).map(
        (statistic) => {
          if (statistic[prop] !== null) {
            neededProps.push(`${statistic[prop]}`);
            return statistic.result;
          }
        }
      )
    );

    const longestValueLength = max(values.map((value) => value?.length)) || 0;
    const resultsByUser: number[][] = [];

    for (let i = 0; i < longestValueLength; i++) {
      for (let j = 0; j < users.length; j++) {
        if (!resultsByUser[i]) {
          resultsByUser[i] = [];
        }
        resultsByUser[i][j] = (values[j] || [])[i] || 0;
      }
    }

    const datasets = resultsByUser.map(
      (value, i) => ({
        data: value,
        label: neededProps[i],
        backgroundColor: colors[i]
      })
    );

    return {
      labels: users.map((user) => `${user.userName ?? user[prop]}`),
      datasets
    };

  };

  const createNotLoggedInData = (prop: keyof StatisticType): ChartData => {
    const datasets = reject(statistics?.notLoggedIn, (s) => s[prop] === null).map(
      (value, i) => ({
        data: [value.result],
        label: `${value[prop]}`,
        backgroundColor: colors[i]
      })
    );

    return {
      labels: ['nem ismert felhasználók'],
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
          <Bar type='bar' data={notLoggedInPackageData} options={{ plugins: { legend: { display: false } } }}/>
        </div>
        <div style={styles.chart}>
          <h2>Futtatott tesztek eredményei</h2>
          <Bar type='bar' data={notLoggedInTestData} options={{ plugins: { legend: { display: false } } }}/>
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
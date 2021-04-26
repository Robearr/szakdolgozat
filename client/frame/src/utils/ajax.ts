import { PackageType, TestType } from '../views/PackageView';
import { StatisticType } from '../views/StatisticsView';

type ErrorResponseType = {
  severity: string,
  messages: string[]
};

export type LoginResponseType = ErrorResponseType & {
  token: string
};

export type ResultResponseType = ErrorResponseType & ErrorResponseType[] & {
  points?: number,
  customErrorMessage?: string,
  errorDescription?: string,
  stack?: string
};

export type ResultsResponseType = ResultResponseType[];

export type StatisticResponseType = {
  loggedIn: StatisticType[],
  notLoggedIn: StatisticType[]
};

export type PackagesResponseType = ErrorResponseType & PackageType[] & PackageType;
export type TestsResponseType = TestType[] & TestType;

type GetResponseType = PackagesResponseType & TestsResponseType & StatisticResponseType;
type PostResponseType = LoginResponseType & ResultResponseType & ResultsResponseType;

const ajax = {
  get: (url: string, options?: RequestInit): Promise<GetResponseType> => {
    return fetch(`${process.env.REACT_APP_API_BASE_URL}/${url}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    }).then(
      (res) => res.json()
    ).catch(
      (err) => console.log(err)
    );
  },
  post: (url: string, body: Record<string, unknown>, options?: RequestInit): Promise<PostResponseType> => {
    return fetch(`${process.env.REACT_APP_API_BASE_URL}/${url}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    }).then(
      (res) => res.json()
    ).catch(
      (err) => console.log(err)
    );
  }
};

export default ajax;
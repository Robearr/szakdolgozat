import { PackageType, TestType } from '../views/PackagesView';

type ErrorResponseType = {
  severity: string,
  messages: string[]
};

export type LoginResponseType = ErrorResponseType & {
  token: string
};

export type ResultResponseType = ErrorResponseType & {
  points: number
}[];

export type PackagesResponseType = ErrorResponseType & PackageType[] & PackageType;
export type TestsResponseType = TestType[] & TestType;

type GetResponseType = PackagesResponseType & TestsResponseType;
type PostResponseType = LoginResponseType & ResultResponseType;

const ajax = {
  get: (url: string): Promise<GetResponseType> => {
    return fetch(`${process.env.REACT_APP_API_BASE_URL}/${url}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(
      (res) => res.json()
    ).catch(
      (err) => console.log(err)
    );
  },
  post: (url: string, body: Record<string, unknown>): Promise<PostResponseType> => {
    return fetch(`${process.env.REACT_APP_API_BASE_URL}/${url}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(
      (res) => res.json()
    ).catch(
      (err) => console.log(err)
    );
  }
};

export default ajax;
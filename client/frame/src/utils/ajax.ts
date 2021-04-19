type ErrorResponseType = {
  severity: string,
  messages: string[]
};

export type LoginResponseType = ErrorResponseType & {
  token: string
}

type PostResponseType = LoginResponseType;

const ajax = {
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
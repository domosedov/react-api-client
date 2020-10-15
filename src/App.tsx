import React, { ChangeEvent, FormEvent, MouseEvent } from "react";
import jwt from "jsonwebtoken";

type LoginResponse = {
  id: string;
  login: string;
  displayName: string;
  token: string;
  refreshToken: string;
};

type TokenDecodeResult = {
  data: any;
  exp: number;
  iat: number;
  iss: string;
  nbf: number;
};

function App() {
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [data, setData] = React.useState<LoginResponse>();
  const [authToken, setAuthToken] = React.useState<string>("");
  // const [expires, setExpires] = React.useState();

  const handelChangeLogin = (evt: ChangeEvent<HTMLInputElement>) => {
    setLogin(evt.target.value);
  };

  const handleChangePassword = (evt: ChangeEvent<HTMLInputElement>) => {
    setPassword(evt.target.value);
  };

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();

    try {
      const response = await fetch("https://domosedov-dev.info/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      // for (const [key, value] of response.headers.entries()) {
      //   console.log(key, value);
      // }

      console.dir(response);

      const result: LoginResponse = await response.json();

      const { token } = result;

      setAuthToken(token);

      const decoded: any = jwt.decode(token);

      const { exp, iat } = decoded;

      if (decoded) {
        const expDate = new Date(exp);
        const issDate = new Date(iat);
        console.log(expDate.toUTCString());
        console.log(issDate.toUTCString());
        console.log(exp - iat);
      }

      console.log(decoded);

      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = async (evt: MouseEvent) => {
    evt.preventDefault();
    try {
      const response = await fetch(
        "http://wp-api-extended.local/wp-json/wp/v2/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: "From React Client",
            status: "publish",
          }),
        }
      );

      const result = await response.json();
      console.dir(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>JWT Test Client</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login">Login:</label>
        <input
          id="login"
          type="text"
          name="login"
          value={login}
          onChange={handelChangeLogin}
        />
        <br />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="text"
          name="password"
          value={password}
          onChange={handleChangePassword}
        />
        <button type="submit">Submit</button>
      </form>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <button type="button" onClick={handleClick}>
        Get Posts
      </button>
    </div>
  );
}

export default App;

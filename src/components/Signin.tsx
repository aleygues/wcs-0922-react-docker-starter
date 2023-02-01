import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { signin } from "../graphql/signin";
import { useUser } from "../hooks/user.context";

export function Signin() {
  const { login } = useUser();
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("supersecret");
  const [wrongCredentials, setWrongCredentials] = useState(false);

  const [doSigninMutation, { loading, error }] = useMutation(signin);

  async function doSignin() {
    try {
      const { data } = await doSigninMutation({
        variables: {
          email,
          password,
        },
      });
      // data.signin = "uijbsdgbsdogjuvb";
      if (data.signin) {
        login(data.signin);
      } else {
        setWrongCredentials(true);
      }
    } catch {}
  }

  return (
    <>
      <h1>Signin</h1>
      {wrongCredentials === true && <p>Wrong credentials</p>}
      {error && (
        <pre style={{ color: "red" }}>{JSON.stringify(error, null, 4)}</pre>
      )}
      <p>Email:</p>
      <input
        disabled={loading}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <p>Password:</p>
      <input
        disabled={loading}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button disabled={loading} onClick={doSignin}>
        Signin
      </button>
    </>
  );
}

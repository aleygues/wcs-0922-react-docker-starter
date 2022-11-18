import React, { useEffect, useState } from "react";
import "./App.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
  useLazyQuery,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUser } from "./graphql/createUser";
import { signin } from "./graphql/signin";
import { me } from "./graphql/me";
import { users } from "./graphql/users";
import { createComment } from "./graphql/createComment";
import { comments } from "./graphql/comments";

interface IUser {
  id: number;
  email: string;
}

interface IComment {
  id: number;
  comment: string;
  createdBy: IUser;
  createdAt: string;
}

function Signin(props: { onTokenChange: (token: string) => void }) {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("supersecret");
  const [wrongCredentials, setWrongCredentials] = useState(false);

  const [doSigninMutation, { data, loading, error }] = useMutation(signin);

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
        props.onTokenChange(data.signin);
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

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [doSignupMutation, { data, loading, error }] = useMutation(createUser);

  async function doSignup() {
    try {
      await doSignupMutation({
        variables: {
          data: {
            email,
            password,
          },
        },
      });
      setEmail("");
      setPassword("");
    } catch {}
  }

  return (
    <>
      <h1>Signup</h1>
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
      <button disabled={loading} onClick={doSignup}>
        Signup
      </button>
    </>
  );
}

function Comments() {
  const [comment, setComment] = useState("");
  const { data } = useQuery<{ comments: IComment[] }>(comments);
  const [doCreateComment] = useMutation(createComment, {
    refetchQueries: [comments],
  });

  async function sendComment() {
    try {
      await doCreateComment({
        variables: {
          data: {
            comment,
          },
        },
      });
      setComment("");
    } catch {}
  }

  return (
    <>
      {data?.comments.map((comment) => (
        <p>
          {comment.comment} by {comment.createdBy?.email || "Unknown"} at{" "}
          {comment.createdAt}
        </p>
      ))}
      <hr />
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={sendComment}>Send!</button>
    </>
  );
}

function Dashboard(props: {
  user: IUser;
  onTokenChange: (token?: string) => void;
}) {
  const { data } = useQuery<{ users: IUser[] }>(users);

  return (
    <>
      <h1>Dashboard</h1>
      <p>Hello {props.user.email}!</p>
      {data?.users.map((user) => (
        <p>{user.email}</p>
      ))}
      <h1>Some comments?</h1>
      <Comments />
      <br />
      <br />
      <button
        onClick={() => {
          props.onTokenChange();
        }}
      >
        Signout
      </button>
    </>
  );
}

function Main() {
  const [user, setUser] = useState<IUser | null | undefined>(undefined);
  const { data, refetch, error } = useQuery(me);

  useEffect(() => {
    if (error) {
      setUser(null);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      if (data.me) {
        setUser(data.me);
      }
    }
  }, [data]);

  function onTokenChange(token?: string) {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    setUser(undefined);
    refetch();
  }

  return (
    <div style={{ padding: 16 }}>
      {user ? (
        <Dashboard user={user} onTokenChange={onTokenChange} />
      ) : user === null ? (
        <>
          <Signup />
          <hr />
          <Signin onTokenChange={onTokenChange} />
        </>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
}

const httpLink = createHttpLink({
  uri: "http://localhost:5000",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Main />
    </ApolloProvider>
  );
}

export default App;

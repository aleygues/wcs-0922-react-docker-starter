import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { IUser } from "../interfaces";
import { users } from "../graphql/users";
import { Comments } from "./Comments";
import { UserContext } from "../hooks/user.context";

export function Dashboard() {
  const { user, logout } = useContext(UserContext);
  const { data } = useQuery<{ users: IUser[] }>(users);

  return (
    <>
      <h1>Dashboard</h1>
      <p>Hello {user?.email}!</p>
      {data?.users.map((user) => (
        <p>{user.email}</p>
      ))}
      <h1>Some comments?</h1>
      <Comments />
      <br />
      <br />
      <button onClick={logout}>Signout</button>
    </>
  );
}

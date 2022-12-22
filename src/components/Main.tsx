import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { IUser } from "../interfaces";
import { me } from "../graphql/me";
import { Dashboard } from "./Dashboard";
import { Signup } from "./Signup";
import { Signin } from "./Signin";
import { UserContext } from "../hooks/user.context";

export function Main() {
  const [user, setUser] = useState<IUser | null | undefined>(undefined);
  const { data, refetch, error } = useQuery(me, {
    fetchPolicy: "network-only",
  });

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
    <UserContext.Provider value={{ user, logout: () => onTokenChange() }}>
      <div style={{ padding: 16 }}>
        {user ? (
          <Dashboard />
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
    </UserContext.Provider>
  );
}

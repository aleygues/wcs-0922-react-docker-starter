import { useQuery } from "@apollo/client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { me } from "../graphql/me";
import { IUser } from "../interfaces";

export const UserContext = createContext<{
  user: undefined | null | IUser;
  logout: () => void;
  login: (token: string) => void;
}>({
  user: undefined,
  logout: () => {},
  login: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
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
    <UserContext.Provider
      value={{
        user,
        logout: () => onTokenChange(),
        login: (token) => onTokenChange(token),
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

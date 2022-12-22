import { createContext } from "react";
import { IUser } from "../interfaces";

export const UserContext = createContext<{
  user: undefined | null | IUser;
  logout: () => void;
}>({
  user: undefined,
  logout: () => {},
});

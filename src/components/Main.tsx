import { Dashboard } from "./Dashboard";
import { Signup } from "./Signup";
import { Signin } from "./Signin";
import { useUser } from "../hooks/user.context";

export function Main() {
  const { user } = useUser();

  return (
    <div style={{ padding: 16 }}>
      {user ? (
        <Dashboard />
      ) : user === null ? (
        <>
          <Signup />
          <hr />
          <Signin />
        </>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
}

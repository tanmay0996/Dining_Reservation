import { createContext, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [id, setId] = useState();
  const [curruser, setCurruser] = useState();
  const [curruseremail, setCurruseremail] = useState();
  const [isuser, setIsuser] = useState();

  return (
    <UserContext.Provider
      value={{
        id,
        setId,
        curruser,
        setCurruser,
        curruseremail,
        setCurruseremail,
        isuser,
        setIsuser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

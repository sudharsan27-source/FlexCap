import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [selectedNav, setSelectedNav] = useState("Dashboard");

  useEffect(() => {
    const storedAuth = sessionStorage.getItem("userInfo");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  const login = (authData) => {
    debugger;
    let {
      firstName,
      lastName,
      email,
      password,
      createdAt,
      isAdmin = false,
      _id,
    } = authData;
    let userData = {
      firstName,
      lastName,
      email,
      password,
      createdAt,
      isAdmin,
      _id,
    };
    setAuth(userData);
    sessionStorage.setItem("auth", JSON.stringify(authData));
  };

  return (
    <AuthContext.Provider value={{ auth, login, selectedNav, setSelectedNav }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

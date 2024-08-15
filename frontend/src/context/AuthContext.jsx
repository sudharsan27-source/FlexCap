import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [selectedNav, setSelectedNav] = useState("Dashboard");

  // useEffect(() => {
  //   sessionStorage.setItem("selectedNav", selectedNav);
  //   setSelectedNav(sessionStorage.getItem("selectedNav"));
  // }, []);

  return (
    <AuthContext.Provider value={{ selectedNav, setSelectedNav }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

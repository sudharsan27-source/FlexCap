import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [selectedNav, setSelectedNav] = useState("Dashboard");
  const [ishaveCompany, setIsHaveCompany] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  // useEffect(() => {
  //   sessionStorage.setItem("selectedNav", selectedNav);
  //   setSelectedNav(sessionStorage.getItem("selectedNav"));
  // }, []);

  return (
    <AuthContext.Provider
      value={{ selectedNav, setSelectedNav, ishaveCompany, setIsHaveCompany, isLoading, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

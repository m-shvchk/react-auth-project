import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token, expirationTime) => {},
  logout: () => {},
  // default values, just for autocompletion
});

const calculateRemainingTime = expirationTime => expirationTime - Date.now();
// for automatic logout after expiration time
// we get expitation time of the token as the part of responce from Firebase REST API 

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 60000) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken()

  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;
  // '!!' converts to true if there is a token, or false if there is not

  const logoutHandler = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);

    if(logoutTimer){
      clearTimeout(logoutTimer); // clear timer if we logout
    }
  }, []);

  const loginHandler = (token, expirationTime) => {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime)
    setToken(token);
    // logout after expirationTime: 
    const remainingTime = calculateRemainingTime(expirationTime)
    logoutTimer = setTimeout(logoutHandler, remainingTime)

  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext
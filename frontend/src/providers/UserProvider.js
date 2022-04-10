import React from "react";
import { useNavigate } from 'react-router-dom';

import jwt_decode from 'jwt-decode';

// ----------------------------------------------------------------------

const ID_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const EXPIRY_CLAIM = "exp";

const defaultUser = {
  user: undefined,
  userID: undefined,
  role: undefined,
  headers: undefined
};

export const AuthenticatedUser = React.createContext(defaultUser);

// ----------------------------------------------------------------------

export function AuthenticatedUserProvider({ children }) {
  const navigate = useNavigate();
  const userJson = localStorage.getItem("user");
  const user = JSON.parse(userJson);
  const authToken = user ? jwt_decode(user.authToken) : null;
  const userID = authToken ? authToken[ID_CLAIM] : null;
  const role = authToken ? authToken[ROLE_CLAIM] : null;
  const headers = authToken ? {
    "Authorization": "Bearer " + user.authToken,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  } : null;
  if (user && authToken) {
    const tokenExpiryMs = authToken[EXPIRY_CLAIM] * 1000;
    if (tokenExpiryMs < Date.now()) {
      refreshToken(navigate, user);
    }
  }
  return <AuthenticatedUser.Provider value={{ user: user, userID: userID, role: role, headers: headers }}>{children}</AuthenticatedUser.Provider>;
};

function refreshToken(navigate, user) {
  fetch(process.env.REACT_APP_API_SERVER_PATH + '/Token/refresh', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "token": user.authToken,
      "refreshToken": user.refreshToken,
    }),
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw response;
  })
  .then((response) => {
    user.authToken = response.authToken;
    user.refreshToken = response.refreshToken;
    localStorage.setItem("user", JSON.stringify(user));
  })
  .catch(error => {
    console.error(error);
    localStorage.removeItem("user");
    navigate('/dashboard/app');
    window.location.reload(true);
  });
}

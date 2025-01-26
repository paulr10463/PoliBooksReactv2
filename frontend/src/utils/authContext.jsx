import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { isAuth } from '../services/auth.service';

const AuthContext = createContext();

const checkAuthorization = () => {
  // Utilizamos la biblioteca js-cookie para obtener el valor de la cookie
  const authData = Cookies.get('authData');
  return authData ? JSON.parse(authData) : { isAuthorized: false, idToken: null, userID: null };
};

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(checkAuthorization());

  const setAuthorization = (data) => {
    setAuthData(data);
    // Utilizamos js-cookie para establecer o eliminar la cookie
    if (data.isAuthorized) {
      Cookies.set('authData', JSON.stringify(data), { expires: 1 }); // La cookie caduca en 7 días
    } else {
      Cookies.remove('authData');
    }
  };

  // Utilizamos useEffect para verificar la autorización cuando se carga la página
  useEffect(() => {
    const savedAuthData = checkAuthorization();
    if (JSON.stringify(savedAuthData) !== JSON.stringify(authData)) {
      setAuthData(savedAuthData);
    }
  }, [authData]);

  useEffect(() => {
    isAuth(authData.idToken)
      .then((response) => {
        if (response.status === 401) {
          setAuthorization({ isAuthorized: false, idToken: null, userID: null });
        }
      });
  }, []);

  return (
    <AuthContext.Provider value={{ authData, setAuthorization }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

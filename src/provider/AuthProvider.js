import React, { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();
const AuthProvider = (props) => {
  const auth = getAuth();

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Pantau status autentikasi dengan cleanup agar tidak terjadi memory leak
    const unsubscribe = onAuthStateChanged(
      auth,
      (u) => {
        setUser(Boolean(u));
      },
      (error) => {
        console.error("Gagal memantau status login:", error);
        setUser(false);
      }
    );

    return () => {
      try {
        unsubscribe();
      } catch (error) {
        // Log manual jika unsubscribe gagal, tanpa mengganggu alur pengguna
        console.error("Gagal menghentikan listener auth:", error);
      }
    };
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

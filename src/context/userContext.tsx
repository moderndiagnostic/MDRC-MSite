// src/context/userContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const UserContext = createContext<any>(null);

export const useUser = () => useContext(UserContext);

export const setAuthCookie = (user: any) => {
  Cookies.set("auth_user", JSON.stringify(user), {
    path: "/",
    sameSite: "lax",
  });
};

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let parsedUser = null;
    const token = Cookies.get("auth_user");

    if (!token || token === "null") {
      setUser(null);
      localStorage.removeItem("auth_user");
      Cookies.remove("auth_user");
      return;
    }

    // const lsUser = localStorage.getItem("auth_user");
    // if (lsUser) {
    //   try {
    //     parsedUser = JSON.parse(lsUser);
    //   } catch (error) {
    //     console.error("Failed to parse user from localStorage", error);
    //   }
    // }

    // If user wasn't found in localStorage, try getting it from cookies
    const cookieUser = Cookies.get("auth_user");
    if (cookieUser) {
      try {
        parsedUser = JSON.parse(cookieUser);
        localStorage.setItem("auth_user", cookieUser); // Sync cookie with localStorage
      } catch (error) {
        console.error("Failed to parse user from cookies", error);
      }
    }

    setUser(parsedUser);
  }, []);

  const updateUser = (userData: any) => {
    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    setAuthCookie(userData);
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

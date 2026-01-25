import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import auth from "../config/firebase.config";
import Cookies from "js-cookie";


//Type for the context
interface AuthContextType {
  EmailPassSignUp: (email: string, password: string) => Promise<UserCredential>;
  EmailPassLogIn: (email: string, password: string) => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
  user: any;
  loading: boolean;
}

//Context
export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  //Email-Password SignUp
  const EmailPassSignUp = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };
  //Email-Password LogIn
  const EmailPassLogIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };
  //password reset
  const resetPassword = async(email:string)=>{
    return await sendPasswordResetEmail(auth, email);
  }
  //Sign-Out
  const logOut = async () => {
    return await signOut(auth);
  };

  //onAuth state change handler
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(false);
      if (currentUser) {
        setUser(currentUser);
        console.log("Firebase User:", currentUser);
      }
      if (!currentUser) {
        setLoading(false);
        setUser(null);
        Cookies.remove("zenEasySelfId");
        Cookies.remove("zenEasySelfToken");
      }
    });
    return () => unSubscribe();
  }, []);

  // auth info
  const authInfo: AuthContextType = {
    EmailPassSignUp,
    EmailPassLogIn,
    logOut,
    resetPassword,
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

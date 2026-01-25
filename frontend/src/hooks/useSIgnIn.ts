import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { serverBaseUrl } from "../utils/baseUrl";
import Cookies from "js-cookie";
import { generateSignInToken } from "../services/authServices";

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const authcontext = useContext(AuthContext);

  if (!authcontext) {
    throw new Error("Authentication context is not available.");
  }
  const { EmailPassLogIn } = authcontext;

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // -----------Firebase user sign in-----------------
      const authResponse = await EmailPassLogIn(email, password);

      if (!authResponse?.user) {
        throw new Error("Firebase Login failed. Check your credentials again.");
      }
      const userEmail = authResponse?.user?.email;
      console.log(userEmail);

      //---------- user id from backend-------------
      if (userEmail) {
        const res = await serverBaseUrl.post("/user/find-id", {
          email: userEmail,
        });
        if (res?.data?.data[0]?._id) {
          const zen_easy_selfId = res.data.data[0]._id;
          Cookies.set("zenEasySelfId", zen_easy_selfId, { expires: 14 });
          const token = await generateSignInToken(zen_easy_selfId);
          Cookies.set("zenEasySelfToken", token.data, { expires: 14 });
          setSuccess(true);
        } else {
          console.warn("Id not found!");
        }
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during registration.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, error, success };
}

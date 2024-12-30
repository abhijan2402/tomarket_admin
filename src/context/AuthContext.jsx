import { auth, db } from "@/lib/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      setLoading(true);

      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();

            if (!userData) {
              logout();
              return toast.error("Invalid Credentials");
            }

            if (userData.role !== "super-admin" && userData.role !== "admin") {
              logout();
              return toast.error("Invalid Credentials");
            }

            setUser({
              email: currentUser?.email,
              id: currentUser?.uid,
              avtar: userData?.avtar,
              createdAt: userData?.createdAt,
              name: userData?.name,
              role: userData?.role,
            });
          } else {
            console.log("No user profile found!");
          }
        } else {
          console.log("No user logged in!");
        }
        setLoading(false);
      });
    } catch (error) {
      console.log("Error fetching user:", error);
      setLoading(false);
    }
  };

  const logout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ setUser, user, loading, setLoading, getUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider");

  return context;
};

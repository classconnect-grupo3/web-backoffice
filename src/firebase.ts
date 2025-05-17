import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  // el resto igual al de tu app
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

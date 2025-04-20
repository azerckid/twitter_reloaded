import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyAfYgQHfWXoDe2Cs8y6Q0aWsjznAQHAQSM",
    authDomain: "react-twitter-clone-d017e.firebaseapp.com",
    projectId: "react-twitter-clone-d017e",
    storageBucket: "react-twitter-clone-d017e.firebasestorage.app",
    messagingSenderId: "1091596428000",
    appId: "1:1091596428000:web:5c20784ddc3d8e2d41a685"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { app } from "./config";

// Lazy initialization
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

export const getFirebaseAuth = () => {
    if (!auth) {
        auth = getAuth(app);
    }
    return auth;
};

export const getFirebaseDb = () => {
    if (!db) {
        db = getFirestore(app);
    }
    return db;
};
// This file is deprecated as the user switched to Local Storage.
// Keeping the file empty or commented out prevents import errors if referenced by mistake,
// though App.tsx has been updated to use services/storage.ts.

/*
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "deprecated",
    authDomain: "deprecated",
    projectId: "deprecated",
};

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
*/

export {}; // Export empty object to satisfy module systems

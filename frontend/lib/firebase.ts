import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from google-services.json
const firebaseConfig = {
    apiKey: "AIzaSyDwsSJYBOeW1Uco2uM4bt4ycvqqGzv9cKo",
    authDomain: "nirogkrishi.firebaseapp.com",
    projectId: "nirogkrishi",
    storageBucket: "nirogkrishi.firebasestorage.app",
    messagingSenderId: "133034986320",
    appId: "1:133034986320:android:8fdd77d5dbc8a49119fa55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

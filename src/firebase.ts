import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración oficial de Firebase Firestore proporcionada por el usuario
export const firebaseConfig = {
  apiKey: "AIzaSyAlJXMUV9xWTcV0rxRlHdAGVaz7uWJUuCo",
  authDomain: "pmmrs-gestion.firebaseapp.com",
  projectId: "pmmrs-gestion",
  storageBucket: "pmmrs-gestion.firebasestorage.app",
  messagingSenderId: "826719278112",
  appId: "1:826719278112:web:16ee80535e573dfb9b5845"
};

// Inicialización de la aplicación Firebase (singleton)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Instancia de Firestore
export const db = getFirestore(app);

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase leída desde variables de entorno (.env).
// Nunca escribas estas credenciales directamente en el código: usa el
// archivo .env.example como referencia y crea tu propio .env local
// (que ya está ignorado por git) o configúralas como Environment
// Variables en Vercel > Settings > Environment Variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  // Aviso claro en consola si alguien olvida configurar el .env,
  // en vez de fallar en silencio o con un error críptico de Firebase.
  console.error(
    '[Firebase] Faltan variables de entorno. Copia .env.example a .env ' +
    'y completa los valores de tu proyecto de Firebase (ver README).'
  );
}

// Evita reinicializar la app si el módulo se vuelve a evaluar (HMR en dev).
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

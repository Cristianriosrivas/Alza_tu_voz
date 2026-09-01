# Configurar Firebase para Alza Tu Voz

Esta app ya está conectada a Firebase Authentication (login/registro real) y
Firestore (base de datos real). Solo falta crear tu proyecto de Firebase y
pegar sus credenciales. Son ~10 minutos.

## 1. Crear el proyecto de Firebase

1. Ve a https://console.firebase.google.com/
2. Clic en **"Agregar proyecto"**, ponle un nombre (ej. `alza-tu-voz`).
3. Puedes desactivar Google Analytics si no lo necesitas.

## 2. Activar Authentication

1. En el menú lateral, entra a **Authentication > Sign-in method** (o "Comenzar").
2. Habilita el proveedor **"Correo electrónico/contraseña"**.

## 3. Crear la base de datos Firestore

1. En el menú lateral, entra a **Firestore Database > Crear base de datos**.
2. Elige el modo **"producción"** (usaremos reglas propias, incluidas en `firestore.rules`).
3. Elige la región más cercana (ej. `us-central` o `southamerica-east1`).

## 4. Aplicar las reglas de seguridad

1. En Firestore, ve a la pestaña **Reglas**.
2. Copia y pega el contenido del archivo `firestore.rules` (incluido en este proyecto) y publica.

Esto asegura que cada usuaria solo pueda leer/editar sus propios reportes y
perfil, y que la Plaza/Comunidades sean de solo lectura+publicación para
cualquier persona autenticada.

## 5. Obtener las credenciales del proyecto

1. Ve a **Configuración del proyecto** (ícono de engranaje) > pestaña **General**.
2. Baja hasta "Tus apps" y clic en el ícono **`</>`** (Web) para registrar una app web.
3. Ponle un nombre (ej. "Alza Tu Voz Web") y clic en "Registrar app".
4. Firebase te mostrará un objeto `firebaseConfig` con estos valores:
   `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.

## 6. Configurar las variables de entorno

**En tu computador (para probar local):**
```
cp .env.example .env
```
Y llena cada valor con lo que copiaste del paso 5.

**En Vercel (para producción):**
1. Ve a tu proyecto en Vercel > **Settings > Environment Variables**.
2. Agrega cada una de las 6 variables (`VITE_FIREBASE_API_KEY`, etc.) con sus valores reales.
3. Haz un **Redeploy** para que tomen efecto.

## 7. Autorizar el dominio de Vercel en Firebase

1. En Firebase, ve a **Authentication > Settings > Authorized domains**.
2. Agrega tu dominio de Vercel (ej. `alza-tu-voz.vercel.app`).

Sin este paso, el login fallará en producción con un error de dominio no autorizado.

## Listo

Con estos pasos, todos los datos (reportes, posts, perfiles, comunidades)
se guardan en Firestore de verdad, y cada persona necesita una cuenta real
para entrar. Los datos de ejemplo que tenías antes ya no existen en el código.

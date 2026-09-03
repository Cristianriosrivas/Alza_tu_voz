# Alza Tu Voz

**Alza Tu Voz** es una aplicación web para reportar y dar seguimiento a incidentes de acoso callejero, pensada como un espacio seguro y confidencial para que las personas —principalmente mujeres— puedan denunciar, acceder a recursos de apoyo y encontrar orientación legal y emocional.

🔗 **Producción:** https://alza-tu-voz.vercel.app

---

## Características principales

- **Registro de denuncias**: formulario guiado para reportar un incidente (fecha, hora, ubicación, descripción, testigos y evidencia fotográfica), con opción de hacerlo de forma anónima.
- **Seguimiento de casos**: cada usuaria puede ver el estado de sus denuncias en tiempo real ("Pendiente", "En Proceso", "Resuelto", etc.) y un timeline con las actualizaciones del operador.
- **Edición de denuncias**: es posible añadir información o evidencia adicional después de enviar el reporte inicial.
- **Evidencia en la nube**: las imágenes adjuntas se suben a Cloudinary y se guardan como URLs públicas, no como archivos locales.
- **Panel de operador**: vista exclusiva para personal autorizado (dominio `@correounivalle.edu.co`) donde se gestionan todas las denuncias, se cambia su estado, se agregan notas internas y se administra el rol de los usuarios.
- **Recursos de apoyo**: acceso a líneas de atención (ej. Línea 155), contacto por WhatsApp y material de orientación legal.
- **Comunidad**: espacio para publicaciones y apoyo entre usuarias.
- **Mapa de ubicaciones**: integración con Leaflet / React-Leaflet para georreferenciar incidentes.
- **Autenticación real**: inicio de sesión con correo/contraseña o con Google, mediante Firebase Authentication.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | React 18 + Vite 6 + TypeScript |
| Estilos | Tailwind CSS 4, shadcn/ui, Radix UI |
| Componentes adicionales | Material UI (`@mui/material`), Embla Carousel, Recharts, Leaflet |
| Backend / datos | Firebase Authentication + Firestore (base de datos en tiempo real) |
| Almacenamiento de imágenes | Cloudinary |
| Formularios | React Hook Form |
| Ruteo | React Router 7 |
| Animaciones | Motion (Framer Motion) |
| Notificaciones UI | Sonner |
| Hosting | Vercel |

## Arquitectura del proyecto

La app sigue un patrón de **hooks + componentes de presentación**:

- Los **hooks** (`useReports`, `useOperator`) concentran toda la lógica de Firebase: suscripción en tiempo real con `onSnapshot`, creación (`addDoc`), actualización (`updateDoc`) y borrado (`deleteDoc`) de documentos en Firestore.
- Los **componentes** (`IncidentReportFlow`, `IncidentDetailView`, `MyReports`, `ReportDetail`, `OperatorDashboard`) son mayormente de presentación y reciben datos y callbacks desde los hooks.
- La subida de archivos a Cloudinary vive en un módulo aparte (`lib/cloudinary.ts`) y se reutiliza tanto en el flujo de creación como en el de edición de denuncias, para evitar subir solo el nombre local del archivo en vez de su URL pública.
- Firestore normaliza los datos leyendo múltiples nombres de campo posibles (español/inglés, ej. `estado` / `status`) para tolerar documentos creados en distintas etapas del proyecto.

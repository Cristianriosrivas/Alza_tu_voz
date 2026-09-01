import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';

import { db } from '../../lib/firebase';

export interface ReportTimelineItem {
  id: string;
  status: string;
  note: string;
  date: string;
  operatorName: string;
}

export interface Denuncia {
  id: string;
  codigoSeguimiento?: string;
  usuario: string;
  emailUsuario: string;
  telefonoUsuario?: string;
  fecha: string;
  categoria: 'Acoso' | 'Violencia Física' | 'Discriminación' | 'Amenazas' | 'Otro' | string;
  descripcion: string;
  lugar?: string;
  latitud?: number | null;
  longitud?: number | null;
  testigos?: string;
  fechaIncidente?: string;
  esAnonimo: boolean;
  estado: 'Pendiente' | 'En Proceso' | 'Resuelto' | 'Rechazado' | 'Archivado' | string;
  notasInternas?: string;
  timeline?: ReportTimelineItem[];
  evidencias?: string[];
}

export interface UsuarioRegistrado {
  id: string;
  nombre: string;
  email: string;
  rol: 'usuario' | 'operador';
  fechaRegistro: string;
}

export function useOperator(currentEmail: string = '') {
  // Validación de dominio Univalle
  const isAllowedDomain = currentEmail.toLowerCase().endsWith('@correounivalle.edu.co');

  const [usuarios, setUsuarios] = useState<UsuarioRegistrado[]>([]);
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);

  // Escuchar colecciones en Firestore en tiempo real
  useEffect(() => {
    if (!isAllowedDomain) {
      setLoading(false);
      return;
    }

    // 1. Escuchar la colección de denuncias/reportes con mapeo completo
    const unsubReports = onSnapshot(
      collection(db, 'reports'),
      (snapshot) => {
        const data: Denuncia[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          const isAnon = d.isAnonymous ?? d.esAnonimo ?? true;

          return {
            id: docSnap.id,
            codigoSeguimiento: d.trackingCode || d.codigoSeguimiento || docSnap.id.substring(0, 8).toUpperCase(),
            usuario: isAnon ? 'Anónimo' : (d.authorName || d.usuario || 'No registrado'),
            emailUsuario: isAnon ? 'N/A' : (d.authorEmail || d.emailUsuario || 'N/A'),
            telefonoUsuario: isAnon ? 'N/A' : (d.authorPhone || d.telefonoUsuario || 'N/A'),
            fecha: d.createdAt?.toDate ? d.createdAt.toDate().toLocaleString() : (d.fecha || 'Reciente'),
            categoria: d.category || d.categoria || 'Otro',
            descripcion: d.description || d.descripcion || '',
            lugar: d.location || d.lugar || 'No especificada',
            latitud: d.latitude ?? d.lat ?? d.locationCoords?.lat ?? d.latitud ?? null,
            longitud: d.longitude ?? d.lng ?? d.locationCoords?.lng ?? d.longitud ?? null,
            testigos: d.witnesses || d.testigos || 'Ninguno / No especificado',
            fechaIncidente: d.dateIncident || d.fechaIncidente || d.date || 'No especificada',
            esAnonimo: isAnon,
            estado: d.status || d.estado || 'Pendiente',
            notasInternas: d.operatorNotes || d.notasInternas || '',
            timeline: d.timeline || [],
            evidencias: d.evidenceUrls || d.evidence || d.evidencias || []
          };
        });

        setDenuncias(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error al obtener denuncias desde Firebase:', error);
        setLoading(false);
      }
    );

    // 2. Escuchar la colección de usuarios
    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const data: UsuarioRegistrado[] = snapshot.docs.map((docSnap) => {
          const u = docSnap.data();
          return {
            id: docSnap.id,
            nombre: u.nombre || u.displayName || u.email?.split('@')[0] || 'Usuario',
            email: u.email || '',
            rol: u.rol || u.role || 'usuario',
            fechaRegistro: u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : (u.fechaRegistro || 'N/A')
          };
        });

        setUsuarios(data);
      },
      (error) => {
        console.error('Error al obtener usuarios desde Firebase:', error);
      }
    );

    return () => {
      unsubReports();
      unsubUsers();
    };
  }, [isAllowedDomain]);

  // 1. Cambiar estado y enviar avance al Timeline visible por el usuario
  const updateDenunciaStatus = async (
    id: string, 
    nuevoEstado: Denuncia['estado'], 
    notaPublica?: string,
    operadorNombre: string = 'Operador Univalle'
  ) => {
    try {
      const denunciaRef = doc(db, 'reports', id);

      const timelineEntry: ReportTimelineItem = {
        id: Date.now().toString(),
        status: nuevoEstado,
        note: notaPublica?.trim() || `El proceso cambió de estado a: ${nuevoEstado}`,
        date: new Date().toLocaleString(),
        operatorName: operadorNombre
      };

      await updateDoc(denunciaRef, {
        estado: nuevoEstado,
        status: nuevoEstado,
        updatedAt: serverTimestamp(),
        timeline: arrayUnion(timelineEntry)
      });
    } catch (error) {
      console.error('Error al actualizar el estado de la denuncia en Firebase:', error);
    }
  };

  // 2. Guardar o actualizar notas internas del operador (privadas)
  const saveNotasInternas = async (id: string, notas: string) => {
    try {
      const denunciaRef = doc(db, 'reports', id);
      await updateDoc(denunciaRef, {
        notasInternas: notas,
        operatorNotes: notas
      });
    } catch (error) {
      console.error('Error al guardar notas internas:', error);
    }
  };

  // 3. Eliminar denuncia de Firestore
  const deleteDenuncia = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reports', id));
    } catch (error) {
      console.error('Error al eliminar la denuncia en Firebase:', error);
    }
  };

  // 4. Otorgar o revocar permiso de Operador en Firestore
  const toggleOperatorRole = async (userId: string) => {
    const userToUpdate = usuarios.find((u) => u.id === userId);
    if (!userToUpdate) return;

    if (userToUpdate.rol === 'usuario' && !userToUpdate.email.toLowerCase().endsWith('@correounivalle.edu.co')) {
      alert('Solo los usuarios con correo @correounivalle.edu.co pueden ser Operadores.');
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      const nuevoRol = userToUpdate.rol === 'operador' ? 'usuario' : 'operador';
      await updateDoc(userRef, {
        rol: nuevoRol,
        role: nuevoRol
      });
    } catch (error) {
      console.error('Error al cambiar el rol de usuario en Firebase:', error);
    }
  };

  // 5. Eliminar usuario de Firestore
  const deleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error('Error al eliminar el usuario en Firebase:', error);
    }
  };

  return {
    isAllowedDomain,
    usuarios,
    denuncias,
    loading,
    updateDenunciaStatus,
    saveNotasInternas,
    deleteDenuncia,
    toggleOperatorRole,
    deleteUser,
  };
}
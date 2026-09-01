import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

// Ajusta la ruta según la ubicación de tu archivo de configuración de Firebase
import { db, auth } from '../../lib/firebase';

export interface ReportTimelineItem {
  id: string;
  status: string;
  note: string;
  date: string;
  operatorName: string;
}

export interface Report {
  id: string;
  codigoSeguimiento?: string;
  category?: string;
  categoria?: string;
  description: string;
  location?: string;
  lugar?: string;
  dateIncident?: string;
  fechaIncidente?: string;
  witnesses?: string;
  evidence?: string[];
  isAnonymous: boolean;
  authorId?: string;
  authorName?: string;
  authorEmail?: string;
  authorPhone?: string;
  status: string;
  estado?: string;
  timeline?: ReportTimelineItem[];
  createdAt?: any;
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(auth?.currentUser || null);

  // 1. Escuchar la autenticación en tiempo real
  useEffect(() => {
    if (!auth) return;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  const userId = currentUser?.uid || '';

  // 2. Escuchar en TIEMPO REAL los cambios en los reportes del usuario actual
  useEffect(() => {
    if (!userId) {
      setReports([]);
      setLoading(false);
      return;
    }

    // Filtrar para que el usuario solo reciba sus propios casos
    const q = query(
      collection(db, 'reports'),
      where('authorId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs: Report[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const currentStatus = data.status || data.estado || 'Pendiente';

          return {
            id: docSnap.id,
            codigoSeguimiento: data.trackingCode || data.codigoSeguimiento || docSnap.id.substring(0, 8).toUpperCase(),
            category: data.category || data.categoria || 'General',
            description: data.description || data.descripcion || '',
            location: data.location || data.lugar || '',
            dateIncident: data.dateIncident || data.fechaIncidente || data.date || '',
            witnesses: data.witnesses || data.testigos || '',
            evidence: data.evidence || data.evidenceUrls || data.evidencias || [],
            isAnonymous: data.isAnonymous ?? data.esAnonimo ?? false,
            authorId: data.authorId || userId,
            authorName: data.authorName || currentUser?.displayName || '',
            authorEmail: data.authorEmail || currentUser?.email || '',
            status: currentStatus,
            estado: currentStatus,
            timeline: data.timeline || [],
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : 'Reciente'
          };
        });

        setReports(docs);
        setLoading(false);
      },
      (error) => {
        console.error('Error al escuchar denuncias en Firebase:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, currentUser]);

  // 3. Crear denuncia con historial de seguimiento (Timeline) inicial
  const addReport = async (newReportData: Partial<Report>) => {
    try {
      const initialTimelineItem: ReportTimelineItem = {
        id: Date.now().toString(),
        status: 'Pendiente',
        note: 'Denuncia registrada con éxito en el sistema.',
        date: new Date().toLocaleString(),
        operatorName: 'Sistema'
      };

      const isAnon = newReportData.isAnonymous ?? false;

      await addDoc(collection(db, 'reports'), {
        trackingCode: Date.now().toString(36).toUpperCase(),
        category: newReportData.category || newReportData.categoria || 'General',
        description: newReportData.description || '',
        location: newReportData.location || newReportData.lugar || '',
        dateIncident: newReportData.dateIncident || newReportData.fechaIncidente || '',
        witnesses: newReportData.witnesses || '',
        evidenceUrls: newReportData.evidence || [],
        isAnonymous: isAnon,
        authorId: userId || null,
        authorName: isAnon ? 'Anónimo' : (newReportData.authorName || currentUser?.displayName || 'Usuario'),
        authorEmail: isAnon ? 'N/A' : (newReportData.authorEmail || currentUser?.email || 'N/A'),
        authorPhone: isAnon ? 'N/A' : (newReportData.authorPhone || 'N/A'),
        status: 'Pendiente',
        estado: 'Pendiente',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        timeline: [initialTimelineItem]
      });
    } catch (error) {
      console.error('Error al agregar denuncia en Firebase:', error);
    }
  };

  // 4. Eliminar denuncia por ID
  const deleteReport = async (idToDelete: string) => {
    try {
      const reportRef = doc(db, 'reports', idToDelete);
      await deleteDoc(reportRef);
    } catch (error) {
      console.error('Error al eliminar denuncia en Firebase:', error);
    }
  };

  // 5. Actualizar datos de la denuncia
  const updateReport = async (updatedReport: Partial<Report> & { id: string }) => {
    try {
      const { id, ...dataToUpdate } = updatedReport;
      const reportRef = doc(db, 'reports', id);
      await updateDoc(reportRef, {
        ...dataToUpdate,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error al actualizar denuncia en Firebase:', error);
    }
  };

  return {
    reports,
    loading,
    addReport,
    deleteReport,
    updateReport,
  };
}
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  getDocs 
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

// TODO: Asegúrate de ajustar esta ruta según dónde guardaste tu config de Firebase
import { db, auth } from '../../lib/firebase';

export interface Reply {
  id: string;
  author: string;
  time: string;
  content: string;
  isMine?: boolean;
}

export interface Post {
  id: string;
  communityId?: string;
  author: string;
  time: string;
  content: string;
  likes: number;
  liked?: boolean;
  isMine?: boolean;
  replies: Reply[];
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  creator: string;
  membersCount: number;
  isJoined: boolean;
  isCreator: boolean;
}

const formatTime = (timestamp: any): string => {
  if (!timestamp) return 'Hace un momento';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export function useCommunity() {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<CommunityGroup[]>([]);

  // 1. Escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  const userId = currentUser?.uid || '';
  const currentUserName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Usuario Anónimo';

  // 2. Cargar Posts y sus Respuestas de Firestore en tiempo real
  useEffect(() => {
    const qPosts = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

    const unsubscribePosts = onSnapshot(qPosts, async (snapshot) => {
      // Mapear cada publicación y cargar dinámicamente sus respuestas en paralelo
      const postsPromises = snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const likesArray: string[] = data.likes || [];

        // Obtener la subcolección de respuestas de esta publicación
        const repliesRef = collection(db, 'posts', docSnap.id, 'replies');
        const qReplies = query(repliesRef, orderBy('createdAt', 'asc'));
        const repliesSnap = await getDocs(qReplies);

        const replies: Reply[] = repliesSnap.docs.map((rDoc) => {
          const rData = rDoc.data();
          return {
            id: rDoc.id,
            author: rData.authorName || 'Anónima',
            time: formatTime(rData.createdAt),
            content: rData.content || '',
            isMine: userId ? rData.authorId === userId : false
          };
        });

        return {
          id: docSnap.id,
          communityId: data.communityId || 'plaza',
          author: data.authorName || 'Anónima',
          time: formatTime(data.createdAt),
          content: data.content || '',
          likes: likesArray.length,
          liked: userId ? likesArray.includes(userId) : false,
          isMine: userId ? data.authorId === userId : false,
          replies
        };
      });

      const loadedPosts = await Promise.all(postsPromises);
      setPosts(loadedPosts);
    });

    return () => unsubscribePosts();
  }, [userId]);

  // 3. Escuchar Comunidades / Grupos
  useEffect(() => {
    const qGroups = query(collection(db, 'groups'), orderBy('createdAt', 'desc'));

    const unsubscribeGroups = onSnapshot(qGroups, (snapshot) => {
      const loadedGroups: CommunityGroup[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const members: string[] = data.members || [];

        return {
          id: docSnap.id,
          name: data.name || '',
          description: data.description || '',
          creator: data.creatorName || 'Administrador',
          membersCount: members.length,
          isJoined: userId ? members.includes(userId) : false,
          isCreator: userId ? data.creatorId === userId : false
        };
      });

      setGroups(loadedGroups);
    });

    return () => unsubscribeGroups();
  }, [userId]);

  // --- ACCIONES CON ACTUALIZACIÓN INMEDIATA (OPTIMISTIC UI) ---

  const addPost = async (content: string, communityId: string = 'plaza') => {
    if (!content.trim() || !userId) return;
    await addDoc(collection(db, 'posts'), {
      content: content.trim(),
      communityId,
      authorId: userId,
      authorName: currentUserName,
      likes: [],
      createdAt: serverTimestamp()
    });
  };

  const deletePost = async (postId: string) => {
    await deleteDoc(doc(db, 'posts', postId));
  };

  const toggleLike = async (postId: string) => {
    if (!userId) return;
    const postRef = doc(db, 'posts', postId);
    const post = posts.find((p) => p.id === postId);

    if (post?.liked) {
      await updateDoc(postRef, { likes: arrayRemove(userId) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(userId) });
    }
  };

  const addReply = async (postId: string, replyContent: string) => {
    if (!replyContent.trim() || !userId) return;

    const newReplyData = {
      content: replyContent.trim(),
      authorId: userId,
      authorName: currentUserName,
      createdAt: serverTimestamp()
    };

    // 1. Guardar en Firestore (Base de datos)
    const replyRef = await addDoc(collection(db, 'posts', postId, 'replies'), newReplyData);

    // 2. Actualizar el estado local inmediatamente para renderizar el comentario en pantalla
    const newReplyLocal: Reply = {
      id: replyRef.id,
      author: currentUserName,
      time: 'Hace un momento',
      content: replyContent.trim(),
      isMine: true
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...(post.replies || []), newReplyLocal]
          };
        }
        return post;
      })
    );
  };

  const deleteReply = async (postId: string, replyId: string) => {
    // 1. Eliminar localmente para feedback inmediato
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            replies: post.replies.filter((r) => r.id !== replyId)
          };
        }
        return post;
      })
    );

    // 2. Eliminar de Firestore
    await deleteDoc(doc(db, 'posts', postId, 'replies', replyId));
  };

  const createCommunity = async (name: string, description: string) => {
    if (!name.trim() || !userId) return;
    await addDoc(collection(db, 'groups'), {
      name: name.trim(),
      description: description.trim(),
      creatorId: userId,
      creatorName: currentUserName,
      members: [userId],
      createdAt: serverTimestamp()
    });
  };

  const toggleJoinCommunity = async (groupId: string) => {
    if (!userId) return;
    const groupRef = doc(db, 'groups', groupId);
    const group = groups.find((g) => g.id === groupId);

    if (group?.isJoined) {
      await updateDoc(groupRef, { members: arrayRemove(userId) });
    } else {
      await updateDoc(groupRef, { members: arrayUnion(userId) });
    }
  };

  const deleteCommunity = async (groupId: string) => {
    await deleteDoc(doc(db, 'groups', groupId));
  };

  return {
    posts,
    groups,
    currentUser: currentUserName,
    addPost,
    deletePost,
    toggleLike,
    addReply,
    deleteReply,
    createCommunity,
    toggleJoinCommunity,
    deleteCommunity
  };
}
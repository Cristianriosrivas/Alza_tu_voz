import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Heart, 
  MessageCircle, 
  Trash2, 
  AlertTriangle,
  Send,
  PlusCircle,
  ShieldCheck,
  UserCheck,
  UserPlus,
  X,
  ChevronRight
} from 'lucide-react';
import { useCommunity, Post, CommunityGroup } from '../../hooks/useCommunity';

interface CommunityProps {
  onBack?: () => void;
}

export function Community({ onBack }: CommunityProps) {
  const { 
    posts, 
    groups, 
    currentUser, 
    addPost, 
    deletePost, 
    toggleLike, 
    addReply, 
    deleteReply, 
    createCommunity, 
    toggleJoinCommunity, 
    deleteCommunity 
  } = useCommunity();

  const [activeTab, setActiveTab] = useState<'principal' | 'comunidades'>('principal');
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(null);

  // Estados de formularios y modales
  const [newPostText, setNewPostText] = useState('');
  const [replyInputs, setReplyInputs] = useState<{ [postId: string]: string }>({});
  const [activeReplyBox, setActiveReplyBox] = useState<string | null>(null);

  // Modal para Crear Comunidad
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  // Modal de confirmación para eliminar
  const [itemToDelete, setItemToDelete] = useState<{ type: 'post' | 'group' | 'reply'; id: string; parentId?: string } | null>(null);

  // Publicar post
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const targetCommunity = selectedGroup ? selectedGroup.id : 'plaza';
    addPost(newPostText, targetCommunity);
    setNewPostText('');
  };

  // Enviar respuesta
  const handleSendReply = (postId: string) => {
    const text = replyInputs[postId];
    if (!text || !text.trim()) return;
    addReply(postId, text);
    setReplyInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  // Crear Comunidad
  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !groupDescription.trim()) return;
    createCommunity(groupName.trim(), groupDescription.trim());
    setGroupName('');
    setGroupDescription('');
    setShowCreateGroupModal(false);
  };

  // Ejecutar eliminación confirmada
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'post') {
      deletePost(itemToDelete.id);
    } else if (itemToDelete.type === 'group') {
      deleteCommunity(itemToDelete.id);
      if (selectedGroup?.id === itemToDelete.id) setSelectedGroup(null);
    } else if (itemToDelete.type === 'reply' && itemToDelete.parentId) {
      deleteReply(itemToDelete.parentId, itemToDelete.id);
    }
    setItemToDelete(null);
  };

  // Filtrar posts según la vista activa (Plaza general o un Grupo específico)
  const currentCommunityId = selectedGroup ? selectedGroup.id : 'plaza';
  const filteredPosts = posts.filter((p) => p.communityId === currentCommunityId);

  return (
    <div className="min-h-screen bg-[#FFFDF7] p-4 md:p-8 font-sans pb-24">
      {/* Header */}
      <div className="max-w-3xl mx-auto flex items-center justify-between mb-4">
        <button
          onClick={selectedGroup ? () => setSelectedGroup(null) : onBack}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {selectedGroup ? `Volver a ${activeTab === 'principal' ? 'Plaza' : 'Comunidades'}` : 'Atrás'}
        </button>
        <div className="flex items-center gap-1.5 text-[#F5A623] font-semibold text-sm">
          <Users className="w-4 h-4" />
          <span>{selectedGroup ? selectedGroup.name : 'Mi comunidad'}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-5">
        {/* Pestañas generales (solo si no se ha entrado a un grupo específico) */}
        {!selectedGroup && (
          <div className="flex border-b border-gray-200 justify-between items-center">
            <div className="flex">
              <button
                onClick={() => setActiveTab('principal')}
                className={`pb-3 px-4 text-sm font-semibold transition border-b-2 ${
                  activeTab === 'principal'
                    ? 'border-[#F5A623] text-[#F5A623]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Plaza principal
              </button>
              <button
                onClick={() => setActiveTab('comunidades')}
                className={`pb-3 px-4 text-sm font-semibold transition border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'comunidades'
                    ? 'border-[#F5A623] text-[#F5A623]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="w-4 h-4" />
                Comunidades
              </button>
            </div>

            {activeTab === 'comunidades' && (
              <button
                onClick={() => setShowCreateGroupModal(true)}
                className="mb-2 bg-[#F5A623] hover:bg-[#e0951c] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                Crear comunidad
              </button>
            )}
          </div>
        )}

        {/* Encabezado especial al entrar a una Comunidad */}
        {selectedGroup && (
          <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-800">{selectedGroup.name}</h2>
                  {selectedGroup.isCreator && (
                    <span className="bg-purple-100 text-[#9B51E0] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Eres Administradora
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{selectedGroup.description}</p>
                <span className="text-[11px] text-gray-400 mt-2 block">
                  {selectedGroup.membersCount} miembros · Creado por {selectedGroup.creator}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleJoinCommunity(selectedGroup.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                    selectedGroup.isJoined
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-[#F5A623] text-white hover:bg-[#e0951c]'
                  }`}
                >
                  {selectedGroup.isJoined ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" /> Unido
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" /> Unirse
                    </>
                  )}
                </button>

                {/* Si eres la creadora, puedes borrar el grupo completo */}
                {selectedGroup.isCreator && (
                  <button
                    onClick={() => setItemToDelete({ type: 'group', id: selectedGroup.id })}
                    className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition"
                    title="Eliminar esta comunidad"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VISTA 1: PLAZA PRINCIPAL O GRUPO SELECCIONADO (PUBLICACIONES) */}
        {(activeTab === 'principal' || selectedGroup) && (
          <>
            {/* Formulario de publicación */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
              <textarea
                rows={3}
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder={
                  selectedGroup
                    ? `Publicar en ${selectedGroup.name}...`
                    : "Escribe tu mensaje para la plaza principal..."
                }
                className="w-full p-3 text-xs text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A623] resize-none"
              />
              <button
                onClick={handlePublish}
                disabled={!newPostText.trim()}
                className="bg-[#F5A623] hover:bg-[#e0951c] disabled:opacity-50 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Publicar mensaje
              </button>
            </div>

            {/* Listado de publicaciones */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-xs bg-white rounded-2xl border border-gray-100">
                  No hay publicaciones aún. ¡Sé la primera en escribir!
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const isMine = post.isMine || post.author === currentUser;
                  // Si el usuario es administrador del grupo actual, también tiene permiso de eliminar posts
                  const canDeletePost = isMine || (selectedGroup && selectedGroup.isCreator);

                  return (
                    <div key={post.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm relative">
                      {/* Cabecera del Post */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#9B51E0] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {post.author.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-800 tracking-wide uppercase flex items-center gap-1.5">
                              {post.author}
                              {isMine && <span className="text-[10px] text-[#F5A623] font-normal">(Tú)</span>}
                            </h4>
                            <span className="text-[11px] text-gray-400">{post.time}</span>
                          </div>
                        </div>

                        {/* Botón de eliminar publicación (Dueño o Admin de la comunidad) */}
                        {canDeletePost && (
                          <button
                            onClick={() => setItemToDelete({ type: 'post', id: post.id })}
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        )}
                      </div>

                      {/* Contenido */}
                      <p className="text-xs text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                        {post.content}
                      </p>

                      {/* Acciones (Me gusta / Responder) */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1.5 transition ${
                            post.liked ? 'text-pink-500 font-semibold' : 'hover:text-pink-500'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.liked ? 'fill-pink-500 text-pink-500' : ''}`} />
                          <span>{post.likes}</span>
                        </button>

                        <button
                          onClick={() => setActiveReplyBox(activeReplyBox === post.id ? null : post.id)}
                          className="flex items-center gap-1.5 hover:text-gray-800 transition"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Responder ({post.replies?.length || 0})</span>
                        </button>
                      </div>

                      {/* SECCIÓN DE RESPUESTAS */}
                      {post.replies && post.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-amber-100 space-y-3 pt-2">
                          {post.replies.map((reply) => {
                            const isReplyMine = reply.isMine || reply.author === currentUser;
                            return (
                              <div key={reply.id} className="bg-gray-50/80 p-3 rounded-xl relative">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[11px] font-bold text-gray-700">
                                    {reply.author} {isReplyMine && <span className="text-[#F5A623] font-normal">(Tú)</span>}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-400">{reply.time}</span>
                                    {isReplyMine && (
                                      <button
                                        onClick={() => setItemToDelete({ type: 'reply', id: reply.id, parentId: post.id })}
                                        className="text-gray-400 hover:text-red-500 transition p-0.5"
                                        title="Eliminar respuesta"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600">{reply.content}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Caja para escribir respuesta */}
                      {activeReplyBox === post.id && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                          <input
                            type="text"
                            placeholder="Escribe una respuesta..."
                            value={replyInputs[post.id] || ''}
                            onChange={(e) => setReplyInputs({ ...replyInputs, [post.id]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendReply(post.id)}
                            className="flex-1 p-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#F5A623]"
                          />
                          <button
                            onClick={() => handleSendReply(post.id)}
                            className="bg-[#F5A623] text-white px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-[#e0951c] transition"
                          >
                            Responder
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* VISTA 2: PESTAÑA DE COMUNIDADES (LISTA DE GRUPOS) */}
        {activeTab === 'comunidades' && !selectedGroup && (
          <div className="space-y-3">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between hover:border-amber-200 transition"
              >
                <div
                  className="flex-1 cursor-pointer pr-4"
                  onClick={() => setSelectedGroup(group)}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-800">{group.name}</h3>
                    {group.isCreator && (
                      <span className="bg-purple-50 text-[#9B51E0] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{group.description}</p>
                  <span className="text-[11px] text-gray-400 mt-2 block">
                    {group.membersCount} miembros · Creado por {group.creator}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleJoinCommunity(group.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                      group.isJoined
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-[#F5A623] text-white hover:bg-[#e0951c]'
                    }`}
                  >
                    {group.isJoined ? 'Unido' : 'Unirse'}
                  </button>

                  <button
                    onClick={() => setSelectedGroup(group)}
                    className="p-1.5 text-gray-400 hover:text-gray-700"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: CREAR NUEVA COMUNIDAD */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowCreateGroupModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-gray-800 mb-1">Crear nueva comunidad</h3>
            <p className="text-xs text-gray-500 mb-4">
              Crea un grupo temático de apoyo. Tendrás permisos de administradora en él.
            </p>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nombre de la comunidad
                </label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Ej. Red de Apoyo - Comuna 1"
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  required
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Explica el propósito de este grupo..."
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A623] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="w-1/3 py-2.5 text-xs font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-[#F5A623] text-white py-2.5 text-xs font-semibold rounded-xl hover:bg-[#e0951c] transition"
                >
                  Crear grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-gray-800 mb-2">
              ¿Eliminar {itemToDelete.type === 'group' ? 'comunidad' : itemToDelete.type === 'reply' ? 'respuesta' : 'publicación'}?
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Esta acción es permanente y no se podrá deshacer.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 bg-red-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-red-700 transition flex items-center justify-center gap-1 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Community;
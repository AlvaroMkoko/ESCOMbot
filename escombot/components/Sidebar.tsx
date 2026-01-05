"use client";

import { useState, useEffect } from 'react';
import { Menu, X, Plus, MessageSquare, LogOut } from 'lucide-react';
import { Chat } from '@/types/chat';

interface SidebarProps {
    currentChatId?: string;
    onSelectChat: (chatId: string) => void;
    onNewChat: () => void;
    onLogout: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function Sidebar({
    currentChatId,
    onSelectChat,
    onNewChat,
    onLogout,
    isOpen,
    setIsOpen,
}: SidebarProps) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPolling, setIsPolling] = useState(false); // Inicia en false

    useEffect(() => {
        fetchChats();
    }, []);

    // Solo hacer polling si hay indicios de que podría estar autenticado
    useEffect(() => {
        if (!isPolling) return;
        
        const interval = setInterval(() => {
            fetchChats();
        }, 800);
        
        return () => clearInterval(interval);
    }, [isPolling]);

    // Escuchar evento de login/logout desde Header
    useEffect(() => {
        const handleStorageChange = () => {
            const logoutEvent = localStorage.getItem('logoutEvent');
            const loginEvent = localStorage.getItem('loginEvent');
            
            if (logoutEvent) {
                setIsPolling(false); // Detener polling en logout
            } else if (loginEvent) {
                setIsPolling(true); // Reactivar polling en login
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const fetchChats = async () => {
        try {
            const res = await fetch('/api/chats');
            if (res.ok) {
                const data = await res.json();
                setChats(data.chats);
                setIsPolling(true); // Mantener polling activo cuando autenticado
            } else if (res.status === 401) {
                // No autenticado - detener polling
                setChats([]);
                setIsPolling(false);
            } else {
                setChats([]);
            }
        } catch (error) {
            setChats([]);
            setIsPolling(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewChat = async () => {
        try {
            const res = await fetch('/api/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'Nueva conversación' }),
            });

            if (res.ok) {
                const data = await res.json();
                setChats([data.chat, ...chats]);
                onNewChat();
                onSelectChat(data.chat.id);
                setIsOpen(false);
            }
        } catch (error) {
            console.error('Error creating chat:', error);
        }
    };

    const handleSelectChat = (chatId: string) => {
        onSelectChat(chatId);
        setIsOpen(false);
        // Refrescar chats después de seleccionar
        fetchChats();
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-gray-900 text-white transform transition-transform duration-300 z-40 lg:relative lg:top-0 lg:translate-x-0 overflow-y-auto ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="p-4 space-y-2 flex flex-col h-full">
                    <button
                        onClick={handleNewChat}
                        className="flex items-center gap-2 w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo chat
                    </button>

                    <div className="flex-1 overflow-y-auto mt-4">
                        {isLoading ? (
                            <div className="text-center text-gray-400 py-4">
                                Cargando...
                            </div>
                        ) : chats.length === 0 ? (
                            <div className="text-center text-gray-400 py-4 text-sm">
                                Sin conversaciones
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {chats.map((chat) => (
                                    <button
                                        key={chat.id}
                                        onClick={() => handleSelectChat(chat.id)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-2 text-sm truncate ${
                                            currentChatId === chat.id
                                                ? 'bg-gray-700 text-white'
                                                : 'text-gray-300 hover:bg-gray-800'
                                        }`}
                                    >
                                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">{chat.title}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium mt-4 border-t border-gray-700 pt-4"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </>
    );
}

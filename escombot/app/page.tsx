"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();

  const handleNewChat = () => {
    setCurrentChatId(undefined);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleLogout = async () => {
    try {
      // Limpiar todas las cookies de sesión
      document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      document.cookie = 'userId=; Max-Age=0; path=/';
      
      // Llamar a API si existe (para limpiar sesión en servidor)
      try {
        await fetch('/api/logout', { method: 'POST' });
      } catch (e) {
        // No es crítico si falla
      }

      // Limpiar estados locales
      setCurrentChatId(undefined);
      setSidebarOpen(false);
      
      // Navegar a home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        <div className="flex-1 w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-6 flex overflow-hidden">
          <ChatInterface
            chatId={currentChatId}
            onChatCreated={(id) => setCurrentChatId(id)}
          />
        </div>
      </div>
    </main>
  );
}

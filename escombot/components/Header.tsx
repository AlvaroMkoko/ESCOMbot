"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, User, LogIn, LogOut, UserPlus } from 'lucide-react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

interface HeaderProps {
    onMenuClick?: () => void;
    isUserAuthenticated?: boolean;
    onLogout?: () => void;
}

export default function Header({ onMenuClick, isUserAuthenticated = false, onLogout }: HeaderProps) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isPolling, setIsPolling] = useState(false); // Inicia en false

    useEffect(() => {
        // Hacer un check inicial sin polling
        checkAuth();
    }, []);

    // Solo hacer polling si hay indicios de que podría estar autenticado
    useEffect(() => {
        if (!isPolling) return;
        
        const interval = setInterval(() => {
            checkAuth();
        }, 800);
        
        return () => clearInterval(interval);
    }, [isPolling]);

    useEffect(() => {
        // Cerrar dropdown cuando se hace clic fuera
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('[data-user-menu]')) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isUserMenuOpen]);

    const checkAuth = async () => {
        try {
            // Usar /api/me que es más confiable para verificar autenticación
            const res = await fetch('/api/me', {
                method: 'GET',
                credentials: 'include',
            });
            
            if (res.ok) {
                const data = await res.json();
                if (data.user) {
                    // Autenticado
                    setUser({ authenticated: true, ...data.user });
                    setIsPolling(true);
                } else {
                    // Sin usuario
                    setUser(null);
                    setIsPolling(false);
                }
            } else {
                // No autenticado
                setUser(null);
                setIsPolling(false);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
            setIsPolling(false);
        }
    };

    const handleLoginSuccess = () => {
        setIsPolling(true); // Reactivar polling cuando hay login
        localStorage.setItem('loginEvent', Date.now().toString()); // Señal para otros componentes
        checkAuth();
    };

    const handleLogout = async () => {
        try {
            console.log('🔴 Iniciando logout...');
            
            // Cerrar dropdown inmediatamente
            setIsUserMenuOpen(false);
            
            // Llamar al endpoint de logout en el servidor
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Incluir cookies
            });
            
            console.log('📡 Respuesta del servidor:', response.status, response.ok);
            
            // Limpiar estado local
            setUser(null);
            setIsPolling(false);
            localStorage.setItem('logoutEvent', Date.now().toString());
            
            // Recargar la página inmediatamente
            console.log('🔄 Recargando página...');
            setTimeout(() => {
                window.location.href = '/';
            }, 100);
            
        } catch (error) {
            console.error('❌ Logout error:', error);
            // Aún así limpiar estado local incluso si hay error
            setUser(null);
            setIsUserMenuOpen(false);
            setIsPolling(false);
            setTimeout(() => {
                window.location.href = '/';
            }, 100);
        }
    };

    return (
        <>
            <header className="bg-white border-b border-gray-200 sticky top-0 z-20 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {user && (
                                <button
                                    onClick={onMenuClick}
                                    className="p-2 hover:bg-gray-100 rounded-lg lg:hidden transition-colors"
                                >
                                    <Menu className="w-6 h-6 text-gray-600" />
                                </button>
                            )}
                            <div className="w-10 h-10 flex items-center justify-center">
                                <Image 
                                    src="/escombot_logo.png" 
                                    alt="ESCOMBOT Logo" 
                                    width={40}
                                    height={40}
                                    priority
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 leading-tight">ESCOMBOT</h1>
                                <p className="text-xs text-gray-500 font-medium tracking-wide">Asistente Virtual Escolar</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-sm font-medium text-blue-900 bg-blue-50 px-3 py-1 rounded-full">
                                Prototipo v2.1
                            </div>
                            {user ? (
                                <div className="relative" data-user-menu>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium text-blue-900"
                                    >
                                        <User className="w-4 h-4" />
                                        <span className="hidden sm:inline">Mi cuenta</span>
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )  : (
  <div className="relative" data-user-menu>
    <button
      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
      className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-medium text-sm transition-colors"
    >
      <LogIn className="w-4 h-4" />
      <span className="hidden sm:inline">Acceso</span>
    </button>

    {isUserMenuOpen && (
      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLoginModalOpen(true);
            setIsUserMenuOpen(false);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors text-sm font-medium"
        >
          <LogIn className="w-4 h-4" />
          <span>Iniciar sesión</span>
        </button>

        <div className="border-t border-gray-200"></div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsSignupModalOpen(true);
            setIsUserMenuOpen(false);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
        >
          <UserPlus className="w-4 h-4" />
          <span>Crear cuenta</span>
        </button>
      </div>
    )}
  </div>
)
}
                        </div>
                    </div>
                </div>
            </header>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />

            <SignupModal
                isOpen={isSignupModalOpen}
                onClose={() => setIsSignupModalOpen(false)}
                onSignupSuccess={handleLoginSuccess}
            />
        </>
    );
}

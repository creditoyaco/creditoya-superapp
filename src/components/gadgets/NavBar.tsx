"use client"

import { User, Moon, Sun, Menu, X } from 'lucide-react';
import creditoyaLogo from "@/assets/logos/creditoya_logo_minimalist.png"
import Image from 'next/image';
import useNavBar from '@/hooks/useNavBar';

function NavBar() {

    const {
        scrolled,
        darkmode,
        isMenuOpen,
        router,
        changeDarkMode,
        setIsMenuOpen
    } = useNavBar();

    return (
        <div className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${scrolled
                ? `backdrop-blur-md ${darkmode ? 'bg-gray-900/80 dark' : 'bg-white/80'}`
                : `${darkmode ? 'bg-gray-900 dark' : 'bg-white'}`
            }`}>
            {/* Barra de navegación principal */}
            <nav className={`py-3 px-4 md:px-6 max-w-7xl mx-auto ${darkmode ? 'text-gray-100' : 'text-gray-800'}`}>
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Image
                            src={creditoyaLogo.src}
                            alt="logo"
                            width={200}
                            height={100}
                            className='drop-shadow-md dark:invert dark:brightness-[0.87] dark:hue-rotate-180'
                        />
                    </div>

                    {/* Navegación escritorio */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button
                            onClick={changeDarkMode}
                            className={`${darkmode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} transition-colors`}
                            aria-label={darkmode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                        >
                            {darkmode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <button onClick={() => router.push("/auth")} className={`bg-green-50 hover:bg-green-100 cursor-pointer px-3 py-2 text-sm rounded-md ${darkmode ? 'dark:bg-gray-800 dark:hover:bg-gray-700 text-green-300' : 'text-green-500'}`}>
                            <span className="flex items-center font-normal">
                                <User size={16} className={`mr-2 ${darkmode ? 'text-green-300' : 'text-green-500'}`} />
                                Cuenta
                            </span>
                        </button>
                    </div>

                    {/* Botón móvil */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden ${darkmode ? 'text-gray-200' : 'text-gray-600'}`}
                        aria-label="Menú"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Menú móvil */}
            {isMenuOpen && (
                <div className={`md:hidden border-t ${darkmode ? 'border-gray-800 bg-gray-800/95 backdrop-blur-sm' : 'border-gray-100 bg-gray-50/95 backdrop-blur-sm'}`}>
                    <div className="max-w-6xl mx-auto py-3 px-4">
                        <div className="flex items-center justify-between py-2">
                            <span className={`text-sm ${darkmode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Modo {darkmode ? 'oscuro' : 'claro'}
                            </span>
                            <button
                                onClick={changeDarkMode}
                                className={`${darkmode ? 'text-green-400' : 'text-green-600'}`}
                                aria-label={darkmode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                            >
                                {darkmode ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                        </div>

                        <div className="mt-2 pt-2 border-t border-opacity-10 border-gray-400">
                            <button className={`flex items-center py-2 px-3 rounded-md w-full ${darkmode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'}`}>
                                <User size={16} className={`mr-2 ${darkmode ? 'text-green-300' : 'text-green-500'}`} />
                                <span>Cuenta</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NavBar;
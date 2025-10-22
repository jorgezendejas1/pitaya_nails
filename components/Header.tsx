import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { WHATSAPP_LINK, WhatsAppIcon, INSTAGRAM_LINK, InstagramIcon } from '../constants';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Servicios', path: '/servicios' },
        { name: 'Portafolio', path: '/portafolio' },
        { name: 'Equipo', path: '/equipo' },
        { name: 'Nosotros', path: '/nosotros' },
        { name: 'Diplomas', path: '/diplomas' },
        { name: 'Contacto', path: '/contacto' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Effect to handle closing menu on Escape key and manage body scroll
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const linkClasses = "text-pitaya-dark hover:text-pitaya-pink transition duration-300 py-2 text-sm font-medium tracking-wide uppercase";
    const activeLinkClasses = "text-pitaya-pink";

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-pitaya-pearl/80 backdrop-blur-lg shadow-sm' : 'bg-pitaya-pearl'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <div className="lg:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="text-pitaya-dark hover:text-pitaya-pink focus:outline-none" aria-label="Abrir menú" aria-expanded={isOpen}>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                        <Link to="/" className="text-3xl font-bold text-pitaya-pink font-serif ml-4 lg:ml-0">
                            Pitaya Nails
                        </Link>
                    </div>

                    <nav className="hidden lg:flex lg:items-center lg:space-x-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>

                     <div className="hidden lg:flex items-center gap-6">
                        <a
                            href={INSTAGRAM_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pitaya-dark hover:text-pitaya-pink transition duration-300"
                            aria-label="Visita nuestro Instagram"
                        >
                            <InstagramIcon className="w-7 h-7" />
                        </a>
                        <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pitaya-dark hover:text-pitaya-pink transition duration-300"
                            aria-label="Contactar por WhatsApp"
                        >
                            <WhatsAppIcon className="w-7 h-7" />
                        </a>
                        <Link
                            to="/servicios"
                            className="bg-pitaya-pink text-white font-semibold px-6 py-3 rounded-full hover:bg-opacity-90 transition duration-300 transform hover:scale-105 shadow-sm"
                        >
                            Reservar Ahora
                        </Link>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div 
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            ></div>


            {/* Mobile Menu Panel */}
            <div 
                className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-pitaya-pearl shadow-lg z-50 transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                role="dialog"
                aria-modal="true"
            >
                <div className="p-5 flex justify-between items-center border-b border-gray-200">
                    <Link to="/" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-pitaya-pink font-serif">
                        Pitaya Nails
                    </Link>
                    <button onClick={() => setIsOpen(false)} className="text-pitaya-dark hover:text-pitaya-pink focus:outline-none" aria-label="Cerrar menú">
                         <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="flex flex-col space-y-2 p-5">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `block px-4 py-3 rounded-md text-base font-medium ${isActive ? 'bg-pitaya-pink-light text-pitaya-pink' : 'text-pitaya-dark hover:bg-gray-100'}`}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                     <Link
                        to="/servicios"
                        onClick={() => setIsOpen(false)}
                        className="bg-pitaya-pink text-white font-semibold w-full text-center px-6 py-3 rounded-full hover:bg-opacity-90 transition duration-300 mt-6"
                    >
                        Reservar Ahora
                    </Link>
                    <div className="flex items-center justify-center space-x-6 pt-6 border-t border-gray-200 mt-6">
                        <a
                            href={INSTAGRAM_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="text-pitaya-dark hover:text-pitaya-pink transition duration-300"
                            aria-label="Visita nuestro Instagram"
                        >
                            <InstagramIcon className="w-8 h-8" />
                        </a>
                        <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="text-pitaya-dark hover:text-pitaya-pink transition duration-300"
                            aria-label="Contactar por WhatsApp"
                        >
                            <WhatsAppIcon className="w-8 h-8" />
                        </a>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
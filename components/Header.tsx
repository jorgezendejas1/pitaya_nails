import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { WHATSAPP_LINK, WhatsAppIcon } from '../constants';

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

    const linkClasses = "text-pitaya-dark hover:text-pitaya-pink transition duration-300 py-2 text-sm font-medium tracking-wide uppercase";
    const activeLinkClasses = "text-pitaya-pink";

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-pitaya-pearl/80 backdrop-blur-lg shadow-sm' : 'bg-pitaya-pearl'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <div className="lg:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="text-pitaya-dark hover:text-pitaya-pink focus:outline-none" aria-label="Abrir menú">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
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

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-pitaya-pearl shadow-lg">
                    <nav className="flex flex-col items-center space-y-4 p-4">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                         <Link
                            to="/servicios"
                            onClick={() => setIsOpen(false)}
                            className="bg-pitaya-pink text-white font-semibold w-full text-center px-6 py-3 rounded-full hover:bg-opacity-90 transition duration-300 mt-4"
                        >
                            Reservar Ahora
                        </Link>
                        <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 text-pitaya-dark hover:text-pitaya-pink transition duration-300 mt-2 py-2"
                            aria-label="Contactar por WhatsApp"
                        >
                            <WhatsAppIcon className="w-6 h-6" />
                            <span>Chatea con nosotros</span>
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;

import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

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

    const linkClasses = "text-gray-700 hover:text-pitaya-pink transition duration-300 py-2";
    const activeLinkClasses = "text-pitaya-pink font-semibold";

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-white'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="text-2xl font-bold text-pitaya-pink">
                        Pitaya Nails
                    </Link>

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

                     <div className="hidden lg:block">
                        <Link
                            to="/servicios"
                            className="bg-pitaya-pink text-white font-semibold px-6 py-2 rounded-full hover:bg-opacity-90 transition duration-300 transform hover:scale-105 shadow-sm"
                        >
                            Reservar Ahora
                        </Link>
                    </div>

                    <div className="lg:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-pitaya-pink focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-white shadow-lg">
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
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;

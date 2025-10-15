import React from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP_LINK, INSTAGRAM_LINK, InstagramIcon, WhatsAppIcon } from '../constants';

const Footer: React.FC = () => {
    return (
        <footer className="bg-pitaya-beige text-pitaya-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-bold text-pitaya-pink mb-4">Pitaya Nails</h3>
                        <p className="text-pitaya-dark/70">Arte en uñas con el toque de Cancún.</p>
                         <p className="mt-4 text-sm text-pitaya-dark/70">Lun - Sáb: 10:00 - 20:00</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">Navegación</h3>
                        <ul className="space-y-2">
                            <li><Link to="/servicios" className="hover:text-pitaya-pink transition">Servicios</Link></li>
                            <li><Link to="/portafolio" className="hover:text-pitaya-pink transition">Portafolio</Link></li>
                            <li><Link to="/nosotros" className="hover:text-pitaya-pink transition">Nosotros</Link></li>
                            <li><Link to="/contacto" className="hover:text-pitaya-pink transition">Contacto</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">Síguenos</h3>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="text-pitaya-dark/80 hover:text-pitaya-pink transition">
                                <InstagramIcon className="w-6 h-6" />
                            </a>
                            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-pitaya-dark/80 hover:text-pitaya-pink transition">
                                <WhatsAppIcon className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-pitaya-dark/10 mt-8 pt-6 text-center text-sm text-pitaya-dark/60">
                    <p>&copy; {new Date().getFullYear()} Pitaya Nails. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
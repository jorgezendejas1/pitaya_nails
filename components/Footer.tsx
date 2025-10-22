import React from 'react';
import { Link } from 'react-router-dom';
import { 
    WHATSAPP_LINK, 
    INSTAGRAM_LINK, 
    InstagramIcon, 
    WhatsAppIcon,
    LocationMarkerIcon,
    PhoneIcon,
    MailIcon,
    ClockIcon
} from '../constants';

const Footer: React.FC = () => {

    const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Servicios', path: '/servicios' },
        { name: 'Portafolio', path: '/portafolio' },
        { name: 'Equipo', path: '/equipo' },
        { name: 'Nosotros', path: '/nosotros' },
        { name: 'Contacto', path: '/contacto' },
    ];

    return (
        <footer className="bg-pitaya-beige text-pitaya-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
                    
                    {/* Column 1: Brand & Hours */}
                    <div>
                        <h3 className="text-2xl font-bold text-pitaya-pink mb-4 font-serif">Pitaya Nails</h3>
                        <p className="text-pitaya-dark/70 mb-4">Arte en uñas con el toque de Cancún.</p>
                        <div className="flex items-center justify-center sm:justify-start text-pitaya-dark/80">
                            <ClockIcon className="w-5 h-5 mr-2 text-pitaya-pink" />
                            <span>Lun - Sáb: 10:00 - 20:00</span>
                        </div>
                    </div>

                    {/* Column 2: Navigation */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider font-serif">Navegación</h3>
                        <ul className="space-y-2">
                            {navLinks.map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="hover:text-pitaya-pink transition-colors duration-300">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider font-serif">
                            <Link to="/contacto" className="hover:text-pitaya-pink transition-colors duration-300">
                                Contacto
                            </Link>
                        </h3>
                        <ul className="space-y-3 text-pitaya-dark/90">
                            <li className="flex items-center justify-center sm:justify-start">
                                <LocationMarkerIcon className="w-5 h-5 mr-3 text-pitaya-pink flex-shrink-0" />
                                <a 
                                    href="https://www.google.com/maps/place/Jardines+del+Sur+5/@21.1067629,-86.8854156,17z/data=!3m1!4b1!4m6!3m5!1s0x8f4c2b487911fd6b:0xeaa4b068d096f1b1!8m2!3d21.1067629!4d-86.8854156!16s%2Fg%2F11vdw62dv5?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-pitaya-pink transition-colors"
                                >
                                    Jardines del Sur 5, CP 77536, Cancún
                                </a>
                            </li>
                            <li className="flex items-center justify-center sm:justify-start">
                                <PhoneIcon className="w-5 h-5 mr-3 text-pitaya-pink flex-shrink-0" />
                                <a href="tel:+529841123411" className="hover:text-pitaya-pink transition-colors">+52 984 112 3411</a>
                            </li>
                            <li className="flex items-center justify-center sm:justify-start">
                                <MailIcon className="w-5 h-5 mr-3 text-pitaya-pink flex-shrink-0" />
                                <a href="mailto:info@pitayanails.com" className="hover:text-pitaya-pink transition-colors">info@pitayanails.com</a>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Column 4: Social Media */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider font-serif">Redes Sociales</h3>
                        <div className="flex justify-center sm:justify-start space-x-4">
                            <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="text-pitaya-dark/80 hover:text-pitaya-pink transition-colors duration-300" aria-label="Instagram">
                                <InstagramIcon className="w-7 h-7" />
                            </a>
                            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-pitaya-dark/80 hover:text-pitaya-pink transition-colors duration-300" aria-label="WhatsApp">
                                <WhatsAppIcon className="w-7 h-7" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-pitaya-dark/10 mt-10 pt-6 text-center text-sm text-pitaya-dark/60">
                    <p>&copy; {new Date().getFullYear()} Pitaya Nails. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
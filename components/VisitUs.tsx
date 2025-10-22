
import React from 'react';
import { Link } from 'react-router-dom';
import { LocationMarkerIcon, PhoneIcon, MailIcon, ClockIcon } from '../constants';

const infoCards = [
    {
        icon: <LocationMarkerIcon className="w-8 h-8 text-white" />,
        title: 'Ubicación',
        lines: ['Av. Principal 123', 'Centro, Ciudad'],
    },
    {
        icon: <PhoneIcon className="w-8 h-8 text-white" />,
        title: 'Teléfono',
        lines: ['+34 123 456 789'],
    },
    {
        icon: <MailIcon className="w-8 h-8 text-white" />,
        title: 'Email',
        lines: ['info@pitayanails.com'],
    },
    {
        icon: <ClockIcon className="w-8 h-8 text-white" />,
        title: 'Horario',
        lines: ['Lun - Sáb', '10:00 - 20:00'],
    },
];

const VisitUs: React.FC = () => {
    return (
        <section className="bg-gradient-to-b from-pitaya-pink-light/20 to-pitaya-pearl py-20 md:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-pitaya-dark mb-4">Visítanos</h2>
                <p className="text-lg text-pitaya-dark/70 mb-12 max-w-xl mx-auto">
                    Estamos aquí para hacer tus uñas lucir increíbles
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {infoCards.map((card, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl flex flex-col items-center transform hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-5 shadow-md">
                                {card.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-pitaya-dark mb-2 font-serif">{card.title}</h3>
                            <div className="text-pitaya-dark/70">
                                {card.lines.map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <Link
                    to="/servicios"
                    style={{
                        background: 'linear-gradient(90deg, rgba(214,91,156,1) 0%, rgba(186,104,200,1) 100%)',
                    }}
                    className="inline-block text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                    Reserva tu Cita Ahora
                </Link>
            </div>
        </section>
    );
};

export default VisitUs;

import React from 'react';
import { TEAM } from '../constants';

const Team: React.FC = () => {
    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-pitaya-dark">Nuestro Equipo</h1>
                    <p className="text-lg text-pitaya-dark/70 mt-2">Las artistas detrás de la magia.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {TEAM.map(member => (
                        <div key={member.id} className="bg-white p-6 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <img src={member.imageUrl} alt={member.name} className="w-40 h-40 rounded-full mx-auto mb-4 border-4 border-pitaya-pink/50" />
                            <h3 className="text-2xl font-bold text-pitaya-dark">{member.name}</h3>
                            <p className="text-pitaya-pink font-semibold mb-2">{member.role}</p>
                            <p className="text-pitaya-dark/80">{member.specialty}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Team;
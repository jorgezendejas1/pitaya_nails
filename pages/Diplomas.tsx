
import React from 'react';
import { DIPLOMAS_IMAGES } from '../constants';

const Diplomas: React.FC = () => {
    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="text-center mb-12 reveal-on-scroll">
                    <h1 className="text-4xl md:text-5xl font-bold text-pitaya-dark">Nuestras Certificaciones</h1>
                    <p className="text-lg text-pitaya-dark/70 mt-2">Nuestra preparación, tu garantía de calidad.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {DIPLOMAS_IMAGES.map((diploma, index) => (
                        <div key={diploma.id} className="bg-white p-4 rounded-lg shadow-lg reveal-on-scroll" style={{ transitionDelay: `${index * 100}ms`}}>
                            <img src={diploma.src} alt={diploma.alt} className="w-full h-auto rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Diplomas;
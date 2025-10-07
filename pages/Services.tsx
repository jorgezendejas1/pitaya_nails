
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SERVICES } from '../constants';
import type { Service } from '../types';
import BookingFlow from '../components/BookingFlow';

const Services: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    useEffect(() => {
        const serviceId = searchParams.get('service');
        if (serviceId) {
            const service = SERVICES.find(s => s.id === serviceId) || null;
            setSelectedService(service);
        } else {
            setSelectedService(null);
        }
    }, [searchParams]);

    const handleSelectService = (service: Service) => {
        setSelectedService(service);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Nuestros Servicios</h1>
                    <p className="text-lg text-gray-600 mt-2">Elige tu tratamiento y reserva tu momento de belleza.</p>
                </div>

                {selectedService ? (
                    <BookingFlow service={selectedService} onBack={() => setSelectedService(null)} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {SERVICES.map(service => (
                            <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
                                <img src={service.imageUrl} alt={service.name} className="w-full h-48 object-cover" />
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                                    <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                        <span>{service.duration} min</span>
                                        <span className="font-bold text-pitaya-pink text-lg">${service.price} MXN</span>
                                    </div>
                                    <button
                                        onClick={() => handleSelectService(service)}
                                        className="block w-full text-center bg-pitaya-pink text-white font-semibold py-2 rounded-full hover:bg-opacity-90 transition duration-300 transform group-hover:scale-105"
                                    >
                                        Seleccionar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;

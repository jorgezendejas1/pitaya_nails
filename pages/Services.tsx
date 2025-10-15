import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SERVICES } from '../constants';
import type { Service } from '../types';
import BookingFlow from '../components/BookingFlow';

const Services: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        const serviceId = searchParams.get('service');
        if (serviceId) {
            const service = SERVICES.find(s => s.id === serviceId);
            if (service) {
                setSelectedServices([service]);
                setIsBooking(true);
            }
        }
    }, [searchParams]);

    const handleToggleServiceSelection = (service: Service) => {
        setSelectedServices(prev => {
            if (prev.some(s => s.id === service.id)) {
                return prev.filter(s => s.id !== service.id);
            } else {
                return [...prev, service];
            }
        });
    };
    
    const totals = useMemo(() => {
        return selectedServices.reduce(
            (acc, service) => {
                acc.price += service.price;
                acc.duration += service.duration;
                return acc;
            },
            { price: 0, duration: 0 }
        );
    }, [selectedServices]);

    const handleStartBooking = () => {
        if (selectedServices.length > 0) {
            setIsBooking(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBackToList = () => {
        setIsBooking(false);
        // Clear the search param to prevent re-entering booking mode on refresh/back
        navigate('/servicios', { replace: true });
    };

    return (
        <div className="bg-pitaya-pearl min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                 {isBooking ? (
                    <BookingFlow services={selectedServices} onBack={handleBackToList} />
                ) : (
                    <>
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-pitaya-dark">Nuestros Servicios</h1>
                            <p className="text-lg text-pitaya-dark/70 mt-2">Elige tu tratamiento y reserva tu momento de belleza.</p>
                        </div>
                        
                        <div className="bg-pitaya-pink-light border-l-4 border-pitaya-pink text-pitaya-dark p-4 rounded-md mb-8 shadow-sm" role="alert">
                            <div className="flex">
                                <div className="py-1">
                                    <svg className="fill-current h-6 w-6 text-pitaya-pink mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/></svg>
                                </div>
                                <div>
                                    <p className="font-bold">¿Cómo reservar?</p>
                                    <p className="text-sm">Selecciona uno o más servicios. Cuando termines, presiona el botón "Reservar Cita" que aparecerá en la barra inferior para continuar.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                            {SERVICES.map(service => {
                                const isSelected = selectedServices.some(s => s.id === service.id);
                                return (
                                    <div key={service.id} className={`bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group flex flex-col relative ${isSelected ? 'ring-2 ring-pitaya-pink' : ''}`}>
                                        {isSelected && (
                                             <div className="absolute top-3 right-3 bg-pitaya-pink text-white rounded-full h-6 w-6 flex items-center justify-center z-10" aria-label="Seleccionado">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        )}
                                        <img src={service.imageUrl} alt={service.name} className="w-full h-48 object-cover" />
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-semibold text-pitaya-dark mb-2">{service.name}</h3>
                                            <p className="text-pitaya-dark/70 mb-4 text-sm flex-grow">{service.description}</p>
                                            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                                <span>{service.duration} min</span>
                                                <span className="font-bold text-pitaya-pink text-lg">${service.price} MXN</span>
                                            </div>
                                            <button
                                                onClick={() => handleToggleServiceSelection(service)}
                                                className={`block w-full text-center text-white font-semibold py-3 rounded-full transition duration-300 ${isSelected ? 'bg-gray-500 hover:bg-gray-600' : 'bg-pitaya-pink hover:bg-opacity-90 transform group-hover:scale-105'}`}
                                            >
                                                {isSelected ? 'Quitar selección' : 'Seleccionar'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {selectedServices.length > 0 && (
                            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40 fade-in-up" role="status">
                                <div className="container mx-auto flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-pitaya-dark">{selectedServices.length} {selectedServices.length === 1 ? 'servicio seleccionado' : 'servicios seleccionados'}</p>
                                        <p className="text-sm text-gray-600">Total: ${totals.price} MXN ({totals.duration} min)</p>
                                    </div>
                                    <button onClick={handleStartBooking} className="bg-pitaya-pink text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition transform hover:scale-105">
                                        Reservar Cita
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Services;
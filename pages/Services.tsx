import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SERVICES, MagnifyingGlassIcon } from '../constants';
import type { Service, BookingHistoryItem } from '../types';
import BookingFlow from '../components/BookingFlow';
import QuickAvailabilityViewer from '../components/QuickAvailabilityViewer';
import BookingHistory from '../components/BookingHistory';

// Icon for Grid View
const GridIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

// Icon for List View
const ListIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
);

const priceRangeConfig = {
    '$': { min: 0, max: 399, label: 'Económico' },
    '$$': { min: 400, max: 799, label: 'Moderado' },
    '$$$': { min: 800, max: Infinity, label: 'Premium' },
};
const priceCategories = ['Todos', '$', '$$', '$$$'];

const durationRangeConfig = {
    'Corto': { min: 0, max: 59, label: 'Menos de 1h' },
    'Medio': { min: 60, max: 119, label: '1h - 2h' },
    'Largo': { min: 120, max: Infinity, label: 'Más de 2h' },
};
const durationCategories = ['Todos', 'Corto', 'Medio', 'Largo'];

interface SelectedService {
    service: Service;
    quantity: number;
}

const Services: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
    const [isBooking, setIsBooking] = useState(false);
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [activePriceRange, setActivePriceRange] = useState('Todos');
    const [activeDurationRange, setActiveDurationRange] = useState('Todos');
    const [isViewingAvailability, setIsViewingAvailability] = useState(false);

    const serviceCategories = useMemo(() => ['Todos', ...Array.from(new Set(SERVICES.map(s => s.category)))], []);

    const filteredServices = useMemo(() => {
        let services = SERVICES;
        
        // Filter by category
        if (activeCategory !== 'Todos') {
            services = services.filter(service => service.category === activeCategory);
        }

        // Filter by price range
        if (activePriceRange !== 'Todos') {
            const range = priceRangeConfig[activePriceRange as keyof typeof priceRangeConfig];
            if (range) {
                services = services.filter(service => service.price >= range.min && service.price <= range.max);
            }
        }

        // Filter by duration range
        if (activeDurationRange !== 'Todos') {
            const range = durationRangeConfig[activeDurationRange as keyof typeof durationRangeConfig];
            if (range) {
                services = services.filter(service => service.duration >= range.min && service.duration <= range.max);
            }
        }
        
        // Filter by search term
        if (searchTerm.trim() !== '') {
            const lowercasedTerm = searchTerm.toLowerCase();
            services = services.filter(service =>
                service.name.toLowerCase().includes(lowercasedTerm) ||
                service.description.toLowerCase().includes(lowercasedTerm)
            );
        }
        
        return services;
    }, [activeCategory, searchTerm, activePriceRange, activeDurationRange]);


    useEffect(() => {
        const serviceId = searchParams.get('service');
        if (serviceId) {
            const service = SERVICES.find(s => s.id === serviceId);
            if (service) {
                setSelectedServices([{ service, quantity: 1 }]);
                setIsBooking(true);
            }
        }
    }, [searchParams]);

    const handleToggleServiceSelection = (service: Service) => {
        setSelectedServices(prev => {
            if (prev.some(s => s.service.id === service.id)) {
                return prev.filter(s => s.service.id !== service.id);
            } else {
                return [...prev, { service, quantity: 1 }];
            }
        });
    };
    
    const handleQuantityChange = (serviceId: string, newQuantity: number) => {
        const quantity = Math.max(1, newQuantity); // Ensure quantity is at least 1
        setSelectedServices(prev => 
            prev.map(item => item.service.id === serviceId ? { ...item, quantity } : item)
        );
    };

    const totals = useMemo(() => {
        return selectedServices.reduce(
            (acc, item) => {
                const { service, quantity } = item;
                const price = service.pricePerUnit ? service.price * quantity : service.price;
                const duration = service.durationPerUnit ? service.duration * quantity : service.duration;
                acc.price += price;
                acc.duration += duration;
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
    
    const handleRebook = (historyItem: BookingHistoryItem) => {
        const servicesToBook = historyItem.services
            .map(histService => SERVICES.find(s => s.id === histService.id))
            .filter((s): s is Service => !!s)
            .map(service => ({ service, quantity: 1 })); // Default quantity to 1 for simplicity

        if(servicesToBook.length > 0) {
            setSelectedServices(servicesToBook);
            setIsBooking(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            alert("Algunos de los servicios de esta cita ya no están disponibles.");
        }
    };

    const initialCustomizationsForBooking = useMemo(() => (
        Object.fromEntries(
            selectedServices
                .filter(item => item.service.isCustomizable)
                .map(item => [item.service.id, { quantity: item.quantity, notes: '' }])
        )
    ), [selectedServices]);

    const handleBackToList = () => {
        setIsBooking(false);
        // Clear the search param to prevent re-entering booking mode on refresh/back
        navigate('/servicios', { replace: true });
    };

    return (
        <div className="bg-pitaya-pearl min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                 {isBooking ? (
                    <BookingFlow 
                        services={selectedServices.map(s => s.service)} 
                        onBack={handleBackToList} 
                        initialCustomizations={initialCustomizationsForBooking}
                    />
                ) : (
                    <>
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-pitaya-dark font-serif">Nuestros Servicios</h1>
                            <p className="text-lg text-pitaya-dark/70 mt-2">Elige tu tratamiento y reserva tu momento de belleza.</p>
                        </div>
                        
                        <BookingHistory onRebook={handleRebook} />

                        <div className="space-y-6 mb-10">
                            <div className="relative max-w-lg mx-auto">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                                <input
                                    type="search"
                                    name="search"
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pitaya-pink focus:border-pitaya-pink sm:text-sm shadow-sm"
                                    placeholder="Buscar por nombre o descripción..."
                                />
                            </div>

                             <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                                    <div className="space-y-4 flex-grow">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="font-semibold text-gray-700 text-sm w-16 flex-shrink-0">Categoría:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {serviceCategories.map(category => (
                                                    <button
                                                        key={category}
                                                        onClick={() => setActiveCategory(category)}
                                                        className={`px-3 py-1.5 text-sm font-semibold rounded-full transition duration-300 ${activeCategory === category ? 'bg-pitaya-pink text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                                    >
                                                        {category}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="font-semibold text-gray-700 text-sm w-16 flex-shrink-0">Precio:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {priceCategories.map(price => (
                                                    <button
                                                        key={price}
                                                        onClick={() => setActivePriceRange(price)}
                                                        className={`px-3 py-1.5 text-sm font-semibold rounded-full transition duration-300 ${activePriceRange === price ? 'bg-pitaya-pink text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                                    >
                                                        {price}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="font-semibold text-gray-700 text-sm w-16 flex-shrink-0">Duración:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {durationCategories.map(duration => (
                                                    <button
                                                        key={duration}
                                                        onClick={() => setActiveDurationRange(duration)}
                                                        className={`px-3 py-1.5 text-sm font-semibold rounded-full transition duration-300 ${activeDurationRange === duration ? 'bg-pitaya-pink text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                                    >
                                                        {duration === 'Todos' ? duration : durationRangeConfig[duration as keyof typeof durationRangeConfig].label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 self-center lg:self-auto">
                                        <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-full">
                                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-500 hover:text-gray-800'}`} aria-label="Vista de Cuadrícula">
                                                <GridIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-500 hover:text-gray-800'}`} aria-label="Vista de Lista">
                                                <ListIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
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

                        {filteredServices.length > 0 ? (
                            <div className={
                                viewMode === 'grid'
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32"
                                : "flex flex-col gap-6 pb-32"
                            }>
                                {filteredServices.map(service => {
                                    const selectedItem = selectedServices.find(s => s.service.id === service.id);
                                    const isSelected = !!selectedItem;
                                    
                                    const displayPrice = service.pricePerUnit && selectedItem ? service.price * selectedItem.quantity : service.price;
                                    const displayDuration = service.durationPerUnit && selectedItem ? service.duration * selectedItem.quantity : service.duration;

                                    return (
                                        <div 
                                            key={service.id} 
                                            onClick={() => handleToggleServiceSelection(service)}
                                            className={`bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 group relative cursor-pointer ${
                                                isSelected ? 'ring-2 ring-pitaya-pink' : 'ring-2 ring-transparent'
                                            } ${
                                                viewMode === 'grid' ? 'flex flex-col' : 'flex flex-col sm:flex-row'
                                            }`}
                                        >
                                            {isSelected && (
                                                 <div className="absolute top-3 right-3 bg-pitaya-pink text-white rounded-full h-6 w-6 flex items-center justify-center z-10" aria-label="Seleccionado">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                            )}
                                            <div className={`relative ${viewMode === 'grid' ? '' : 'sm:w-52 flex-shrink-0'}`}>
                                                <img 
                                                    src={service.imageUrl} 
                                                    alt={service.name} 
                                                    className={`w-full object-cover ${
                                                        viewMode === 'grid' ? 'h-48' : 'h-48 sm:h-full'
                                                    }`} 
                                                />
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <h3 className="text-xl font-semibold text-pitaya-dark mb-2 font-serif">{service.name}</h3>
                                                <p className="text-pitaya-dark/70 mb-4 text-sm flex-grow">{service.description}</p>
                                                
                                                {service.isCustomizable && isSelected && (
                                                    <div className="flex items-center justify-center gap-4 my-3">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleQuantityChange(service.id, selectedItem.quantity - 1);
                                                            }}
                                                            disabled={selectedItem.quantity <= 1}
                                                            className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold text-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-pitaya-pink disabled:opacity-50 disabled:cursor-not-allowed"
                                                            aria-label={`Reducir cantidad de ${service.name}`}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="font-bold text-lg text-pitaya-dark tabular-nums">{selectedItem.quantity}</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleQuantityChange(service.id, selectedItem.quantity + 1);
                                                            }}
                                                            className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold text-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-pitaya-pink"
                                                            aria-label={`Aumentar cantidad de ${service.name}`}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-2 mb-4">
                                                    <span>{displayDuration} min</span>
                                                    <span className="font-bold text-pitaya-pink text-lg">${displayPrice} MXN</span>
                                                </div>
                                                <div
                                                    className={`w-full text-center text-white font-semibold py-3 rounded-full transition-all duration-300 ${isSelected ? 'bg-gray-500' : 'bg-gradient-to-r from-pitaya-pink to-fuchsia-500 shadow-md group-hover:shadow-lg group-hover:brightness-110'}`}
                                                >
                                                    {isSelected ? 'Quitar selección' : 'Seleccionar'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 px-6 border-2 border-dashed border-gray-300 rounded-lg bg-white my-8">
                                <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-xl font-semibold text-pitaya-dark font-serif">No se encontraron servicios</h3>
                                <p className="mt-2 text-base text-gray-600">
                                    No se encontraron servicios que coincidan con tus filtros. Intenta ajustar la búsqueda, categoría o rango de precio.
                                </p>
                            </div>
                        )}


                        {selectedServices.length > 0 && (
                            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40 fade-in-up" role="status">
                                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="flex-grow text-center sm:text-left">
                                        <p className="font-bold text-pitaya-dark">{selectedServices.length} {selectedServices.length === 1 ? 'servicio seleccionado' : 'servicios seleccionados'}</p>
                                        <div className="flex items-center justify-center sm:justify-start gap-4">
                                            <p className="text-sm text-gray-600">Total: ${totals.price} MXN ({totals.duration} min)</p>
                                            <button 
                                                onClick={() => setIsViewingAvailability(true)} 
                                                className="text-sm text-pitaya-pink hover:underline font-semibold"
                                            >
                                                Ver Disponibilidad Rápida
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 text-center sm:text-right">
                                        <button 
                                            onClick={handleStartBooking} 
                                            className="bg-pitaya-pink text-white font-semibold px-6 py-3 w-full sm:w-auto rounded-full hover:bg-opacity-90 transition transform hover:scale-105 whitespace-nowrap"
                                        >
                                            Reservar Cita
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
             {isViewingAvailability && (
                <QuickAvailabilityViewer
                    totalDuration={totals.duration}
                    onClose={() => setIsViewingAvailability(false)}
                />
            )}
        </div>
    );
};

export default Services;
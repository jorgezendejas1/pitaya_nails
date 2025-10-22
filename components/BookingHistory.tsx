import React, { useState, useEffect } from 'react';
import type { BookingHistoryItem } from '../types';

const BOOKING_HISTORY_KEY = 'pitayaNailsBookingHistory';

interface BookingHistoryProps {
    onRebook: (item: BookingHistoryItem) => void;
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ onRebook }) => {
    const [history, setHistory] = useState<BookingHistoryItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem(BOOKING_HISTORY_KEY);
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error("Failed to load booking history:", error);
        }
    }, []);

    const handleClearHistory = () => {
        if (window.confirm("¿Estás segura de que quieres borrar tu historial de citas?")) {
            localStorage.removeItem(BOOKING_HISTORY_KEY);
            setHistory([]);
            setIsOpen(false);
        }
    };
    
    if (history.length === 0) {
        return null;
    }

    return (
        <div className="mb-10 bg-pitaya-beige p-4 rounded-lg shadow-sm">
            <details onToggle={(e) => setIsOpen((e.currentTarget as HTMLDetailsElement).open)}>
                <summary className="font-semibold text-lg text-pitaya-dark font-serif cursor-pointer list-none flex justify-between items-center">
                    <span>Tu historial de citas</span>
                     <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </summary>
                <div className="mt-4 space-y-4">
                    {history.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="font-bold text-pitaya-dark">
                                    {new Date(item.date).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {item.services.map(s => s.name).join(', ')} con {item.professionalName}
                                </p>
                                 <p className="text-sm text-gray-500">${item.totalPrice} MXN - {item.totalDuration} min</p>
                            </div>
                            <button
                                onClick={() => onRebook(item)}
                                className="bg-pitaya-pink text-white font-semibold px-4 py-2 rounded-full hover:bg-opacity-90 transition text-sm whitespace-nowrap"
                            >
                                Reservar de nuevo
                            </button>
                        </div>
                    ))}
                    <div className="text-right pt-2">
                         <button
                            onClick={handleClearHistory}
                            className="text-sm text-gray-500 hover:text-red-600 hover:underline"
                        >
                            Borrar historial
                        </button>
                    </div>
                </div>
            </details>
        </div>
    );
};

export default BookingHistory;

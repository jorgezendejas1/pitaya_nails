import React, { useState, useMemo } from 'react';
import type { TeamMember } from '../types';
import { TEAM } from '../constants';

interface QuickAvailabilityViewerProps {
    totalDuration: number;
    onClose: () => void;
}

// --- Constants and helpers for availability (reused from BookingFlow) ---
const SALON_OPENS_MIN = 10 * 60; // 10:00 AM in minutes from midnight
const SALON_CLOSES_MIN = 20 * 60; // 8:00 PM
const LUNCH_BREAK_START_MIN = 13 * 60; // 1:00 PM
const LUNCH_BREAK_END_MIN = 14 * 60; // 2:00 PM
const SLOT_INTERVAL = 15; // Check for availability every 15 minutes

const formatTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
};
// --- End of constants and helpers ---

const QuickAvailabilityViewer: React.FC<QuickAvailabilityViewerProps> = ({ totalDuration, onClose }) => {
    const [selectedProfessional, setSelectedProfessional] = useState<TeamMember | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [viewDate, setViewDate] = useState(new Date());

    const availableTimes = useMemo(() => {
        if (!selectedDate || !selectedProfessional || totalDuration === 0) return [];
        const bookedSlots = [{ start: LUNCH_BREAK_START_MIN, end: LUNCH_BREAK_END_MIN }];
        const availableSlots: string[] = [];
        for (let time = SALON_OPENS_MIN; time <= SALON_CLOSES_MIN - totalDuration; time += SLOT_INTERVAL) {
            const slotStart = time;
            const slotEnd = time + totalDuration;
            let isAvailable = true;
            for (const booked of bookedSlots) {
                if (Math.max(slotStart, booked.start) < Math.min(slotEnd, booked.end)) {
                    isAvailable = false;
                    break;
                }
            }
            if (isAvailable) {
                availableSlots.push(formatTime(slotStart));
            }
        }
        return availableSlots;
    }, [selectedDate, selectedProfessional, totalDuration]);

    const handleSelectProfessional = (professional: TeamMember) => {
        setSelectedProfessional(professional);
        if (selectedDate && professional.unavailableDays.includes(selectedDate.getDay())) {
            setSelectedDate(null);
        }
    };

    const handleSelectDate = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        setSelectedDate(newDate);
    };

    const { calendarWeeks, monthName, year } = useMemo(() => {
        const d = viewDate;
        const monthNameStr = d.toLocaleString('es-MX', { month: 'long' });
        const firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
        const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        const days: (Date | null)[] = Array.from({ length: firstDayOfMonth }, () => null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(d.getFullYear(), d.getMonth(), i));
        const weeks = [];
        for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
        if (weeks.length > 0) {
            while (weeks[weeks.length - 1].length < 7) weeks[weeks.length - 1].push(null);
        }
        return { calendarWeeks: weeks, monthName: monthNameStr, year: d.getFullYear() };
    }, [viewDate]);

    const changeMonth = (offset: number) => {
        setViewDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(1);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const isDateUnavailable = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today || (selectedProfessional?.unavailableDays.includes(date.getDay()) ?? false);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="availability-viewer-title"
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 id="availability-viewer-title" className="text-2xl font-bold text-pitaya-dark font-serif">Disponibilidad Rápida</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Cerrar">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {!selectedProfessional ? (
                         <div>
                            <h3 className="text-xl font-semibold mb-4 text-center font-serif">1. Elige una profesional</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {TEAM.map(member => (
                                    <button key={member.id} onClick={() => handleSelectProfessional(member)} className="text-left p-4 border rounded-lg hover:border-pitaya-pink hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-pitaya-pink focus:ring-offset-2 flex flex-col items-center">
                                        <img src={member.imageUrl} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
                                        <h4 className="font-bold text-center text-lg font-serif">{member.name}</h4>
                                        <p className="text-center text-sm text-gray-500">{member.role}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                             <div className="w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-center font-serif">2. Elige una fecha</h3>
                                    <button onClick={() => setSelectedProfessional(null)} className="text-sm text-pitaya-pink hover:underline">Cambiar profesional</button>
                                </div>
                                <div className="max-w-xs mx-auto bg-white p-4 rounded-lg border">
                                    <div className="flex justify-between items-center mb-4">
                                        <button onClick={() => changeMonth(-1)} aria-label="Mes anterior" className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pitaya-pink">&lt;</button>
                                        <h4 className="font-semibold text-lg capitalize font-serif">{monthName} {year}</h4>
                                        <button onClick={() => changeMonth(1)} aria-label="Mes siguiente" className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pitaya-pink">&gt;</button>
                                    </div>
                                    <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
                                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => <div key={i}>{day}</div>)}
                                    </div>
                                    {calendarWeeks.map((week, weekIndex) => (
                                        <div key={weekIndex} className="grid grid-cols-7 text-center">
                                            {week.map((date, dayIndex) => {
                                                if (!date) return <div key={dayIndex} className="w-8 h-8 p-1"></div>;
                                                const isUnavailable = isDateUnavailable(date);
                                                return (
                                                    <div key={dayIndex} className="p-1 flex items-center justify-center">
                                                        <button 
                                                            onClick={() => handleSelectDate(date.getDate())}
                                                            disabled={isUnavailable}
                                                            className={`w-8 h-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pitaya-pink ${isUnavailable ? 'text-gray-300 cursor-not-allowed line-through' : 'hover:bg-pitaya-pink/20'} ${selectedDate?.getTime() === date.getTime() ? 'bg-pitaya-pink text-white' : 'text-gray-800'}`}
                                                        >
                                                            {date.getDate()}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full">
                                <h3 className="text-xl font-semibold mb-4 text-center font-serif">3. Horarios disponibles</h3>
                                {selectedDate ? (
                                    <div className="fade-in">
                                        <h4 className="text-md font-semibold text-center mb-4 font-serif">Para {selectedDate.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric' })}</h4>
                                        {availableTimes.length > 0 ? (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                {availableTimes.map(time => (
                                                    <div key={time} className="p-3 border rounded-lg bg-green-50 text-green-800 text-center font-semibold">
                                                        {time}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center text-gray-500 p-4 border-2 border-dashed rounded-lg">No hay horarios disponibles para este día con una duración de {totalDuration} min. Por favor, selecciona otra fecha.</p>
                                        )}
                                    </div>
                                ) : (
                                     <div className="text-center text-gray-500 p-8 border-2 border-dashed rounded-lg">
                                        <p>Selecciona una fecha en el calendario para ver los horarios.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t text-right">
                    <button 
                        onClick={onClose} 
                        className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-full hover:bg-gray-300 transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickAvailabilityViewer;
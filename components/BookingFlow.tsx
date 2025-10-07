import React, { useState, useMemo } from 'react';
import type { Service, TeamMember } from '../types';
import { TEAM, BOOKING_LINK } from '../constants';

interface BookingFlowProps {
    service: Service;
    onBack: () => void;
}

const steps = ["Profesional", "Fecha y Hora", "Confirmar"];

const BookingFlow: React.FC<BookingFlowProps> = ({ service, onBack }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedProfessional, setSelectedProfessional] = useState<TeamMember | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [viewDate, setViewDate] = useState(new Date());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const availableTimes = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

    const handleSelectProfessional = (professional: TeamMember) => {
        setSelectedProfessional(professional);
        setCurrentStep(1);
    };
    
    const handleSelectDate = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        setSelectedDate(newDate);
        setSelectedTime(null); // Reset time when date changes
    };

    const handleSelectTime = (time: string) => {
        setSelectedTime(time);
        setCurrentStep(2);
    };
    
    const handleFinalizeBooking = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            window.open(BOOKING_LINK, '_blank', 'noopener,noreferrer');
            setIsSubmitting(false);
            setShowSuccess(true);
        }, 1500);
    };
    
    const calendarDays = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    }, [viewDate]);

    const changeMonth = (offset: number) => {
      setViewDate(prevDate => {
          const newDate = new Date(prevDate);
          newDate.setMonth(newDate.getMonth() + offset);
          return newDate;
      });
    };

    const isDateInPast = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Select Professional
                return (
                    <div>
                        <h3 className="text-2xl font-semibold mb-6 text-center">Elige una profesional</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {TEAM.map(member => (
                                <button key={member.id} onClick={() => handleSelectProfessional(member)} className="text-left p-4 border rounded-lg hover:border-pitaya-pink hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-pitaya-pink">
                                    <img src={member.imageUrl} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
                                    <h4 className="font-bold text-center text-lg">{member.name}</h4>
                                    <p className="text-center text-sm text-gray-500">{member.role}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 1: // Select Date and Time
                return (
                     <div>
                        <h3 className="text-2xl font-semibold mb-6 text-center">Elige fecha y hora</h3>
                        {/* Calendar */}
                        <div className="max-w-md mx-auto bg-white p-4 rounded-lg border">
                            <div className="flex justify-between items-center mb-4">
                                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100">&lt;</button>
                                <h4 className="font-semibold text-lg">{viewDate.toLocaleString('es-MX', { month: 'long', year: 'numeric' })}</h4>
                                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100">&gt;</button>
                            </div>
                            <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
                                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(day => <div key={day}>{day}</div>)}
                            </div>
                            <div className="grid grid-cols-7 text-center">
                                {calendarDays.map((date, i) => (
                                    date ? (
                                        <button 
                                            key={i} 
                                            onClick={() => handleSelectDate(date.getDate())}
                                            disabled={isDateInPast(date)}
                                            className={`p-2 rounded-full transition-colors ${isDateInPast(date) ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-pitaya-pink/20'} ${selectedDate?.getTime() === date.getTime() ? 'bg-pitaya-pink text-white' : ''}`}
                                        >
                                            {date.getDate()}
                                        </button>
                                    ) : <div key={i}></div>
                                ))}
                            </div>
                        </div>
                        {/* Available Times */}
                        {selectedDate && (
                            <div className="mt-8">
                                <h4 className="text-lg font-semibold text-center mb-4">Horarios disponibles para {selectedDate.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric' })}</h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-md mx-auto">
                                    {availableTimes.map(time => (
                                        <button key={time} onClick={() => handleSelectTime(time)} className="p-3 border rounded-lg hover:bg-pitaya-pink hover:text-white transition">
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 2: // Confirmation
                if (showSuccess) {
                    return (
                        <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-2xl font-semibold text-green-800">¡Redireccionando!</h3>
                            <p className="text-green-700 mt-2 mb-6">Te hemos redirigido a Google Calendar para que confirmes tu cita. Si la ventana no se abrió, puedes hacer clic abajo.</p>
                            <a 
                                href={BOOKING_LINK}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-full hover:bg-green-700 transition"
                            >
                                Abrir Google Calendar
                            </a>
                        </div>
                    );
                }
                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold mb-4">Confirma tu cita</h3>
                        <div className="bg-gray-50 p-6 rounded-lg shadow-inner border max-w-md mx-auto space-y-3">
                            <p><strong className="text-gray-700">Servicio:</strong> {service.name}</p>
                            <p><strong className="text-gray-700">Profesional:</strong> {selectedProfessional?.name}</p>
                            <p><strong className="text-gray-700">Fecha:</strong> {selectedDate?.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p><strong className="text-gray-700">Hora:</strong> {selectedTime}</p>
                            <p className="font-bold text-lg mt-4"><strong className="text-gray-700">Total:</strong> ${service.price} MXN</p>
                        </div>
                        <p className="mt-6 text-gray-600">Serás redirigido a Google Calendar para finalizar tu reservación.</p>
                        <button 
                            onClick={handleFinalizeBooking}
                            disabled={isSubmitting}
                            className="mt-4 inline-flex items-center justify-center bg-pitaya-pink text-white font-bold py-3 px-10 rounded-full hover:bg-opacity-90 transition transform hover:scale-105 disabled:bg-opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Redirigiendo...
                                </>
                            ) : (
                                'Finalizar en Google Calendar'
                            )}
                        </button>
                    </div>
                );
            default: return null;
        }
    };
    
    const goBackStep = () => {
       if (currentStep > 0) {
           setCurrentStep(currentStep - 1);
       } else {
           onBack();
       }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 md:p-12 rounded-xl shadow-2xl border border-gray-100">
            <div className="flex items-center mb-8">
                <button onClick={goBackStep} className="text-gray-600 hover:text-pitaya-pink transition mr-4 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{service.name}</h2>
                  <p className="text-gray-500">{service.duration} min • ${service.price} MXN</p>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center">
                    {steps.map((step, index) => (
                        <div key={index} className={`flex items-center ${index === steps.length - 1 ? '' : 'flex-grow'}`}>
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${index <= currentStep ? 'bg-pitaya-pink text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {index + 1}
                            </div>
                            <p className={`ml-2 font-semibold transition-colors duration-300 hidden sm:block ${index <= currentStep ? 'text-pitaya-pink' : 'text-gray-500'}`}>{step}</p>
                            {index < steps.length - 1 && <div className={`flex-grow h-1 mx-4 transition-colors duration-500 ${index < currentStep ? 'bg-pitaya-pink' : 'bg-gray-200'}`}></div>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="min-h-[400px]">
                {renderStepContent()}
            </div>
        </div>
    );
};

export default BookingFlow;

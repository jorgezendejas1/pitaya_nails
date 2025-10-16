import React, { useState, useMemo } from 'react';
import type { Service, TeamMember } from '../types';
import { TEAM } from '../constants';

interface BookingFlowProps {
    services: Service[];
    onBack: () => void;
}

const steps = ["Profesional", "Fecha y Hora", "Tus Datos", "Revisar", "Pago", "Confirmado"];

// --- Constants and helpers for availability ---
const SALON_OPENS_MIN = 10 * 60; // 10:00 AM in minutes from midnight
const SALON_CLOSES_MIN = 20 * 60; // 8:00 PM
const LUNCH_BREAK_START_MIN = 13 * 60; // 1:00 PM
const LUNCH_BREAK_END_MIN = 14 * 60; // 2:00 PM
const SLOT_INTERVAL = 15; // Check for availability every 15 minutes

// Helper to format minutes from midnight into a HH:mm string
const formatTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
};
// --- End of constants and helpers ---

const BookingFlow: React.FC<BookingFlowProps> = ({ services, onBack }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedProfessional, setSelectedProfessional] = useState<TeamMember | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [clientDetails, setClientDetails] = useState({ name: '', email: '', phone: '' });
    const [viewDate, setViewDate] = useState(new Date());
    const [isProcessing, setIsProcessing] = useState(false);

    // FIX: Updated accumulator properties to `totalPrice` and `totalDuration` to match destructuring.
    const { totalPrice, totalDuration } = useMemo(() => {
        return services.reduce(
            (acc, service) => {
                acc.totalPrice += service.price;
                acc.totalDuration += service.duration;
                return acc;
            },
            { totalPrice: 0, totalDuration: 0 }
        );
    }, [services]);

    const availableTimes = useMemo(() => {
        if (!selectedDate || !selectedProfessional) return [];

        // The only fixed unavailable time is the lunch break.
        const bookedSlots = [
            { start: LUNCH_BREAK_START_MIN, end: LUNCH_BREAK_END_MIN }
        ];

        const availableSlots: string[] = [];
        // Iterate through potential start times based on the defined interval
        for (let time = SALON_OPENS_MIN; time <= SALON_CLOSES_MIN - totalDuration; time += SLOT_INTERVAL) {
            const slotStart = time;
            const slotEnd = time + totalDuration;
            
            let isAvailable = true;

            // Check for overlap with the lunch break
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


    const handleNextStep = () => setCurrentStep(prev => prev + 1);
    const goToStep = (step: number) => setCurrentStep(step);

    const handleSelectProfessional = (professional: TeamMember) => {
        setSelectedProfessional(professional);
        if (selectedDate && professional.unavailableDays.includes(selectedDate.getDay())) {
            setSelectedDate(null);
            setSelectedTime(null);
        }
        handleNextStep();
    };
    
    const handleSelectDate = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        setSelectedDate(newDate);
        setSelectedTime(null);
    };

    const handleSelectTime = (time: string) => {
        setSelectedTime(time);
        handleNextStep();
    };

    const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClientDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleNextStep();
    };

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            const sendConfirmationEmail = () => {
                 const serviceList = services.map(s => `- ${s.name} ($${s.price} MXN)`).join('\n');
                 const subject = `Confirmación de tu cita en Pitaya Nails`;
                 const body = `Hola ${clientDetails.name},\n\n¡Tu cita en Pitaya Nails está confirmada!\n\nAquí están los detalles:\nServicios:\n${serviceList}\n\nProfesional: ${selectedProfessional?.name}\nFecha: ${selectedDate?.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}\nHora: ${selectedTime}\n\nTotal Pagado: $${totalPrice} MXN\n\nHemos enviado los detalles completos a tu correo electrónico: ${clientDetails.email}.\n\n¡Te esperamos!\n\nSaludos,\nEl equipo de Pitaya Nails`;
                console.log("--- SIMULATING SENDING EMAIL ---", { to: clientDetails.email, subject, body });
            };
            
            sendConfirmationEmail();
            setIsProcessing(false);
            handleNextStep();
        }, 2500);
    };
    
    const { calendarWeeks, monthName, year } = useMemo(() => {
        const d = viewDate;
        const monthNameStr = d.toLocaleString('es-MX', { month: 'long' });
        const firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
        const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        
        const days = Array.from({ length: firstDayOfMonth }, () => null);
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(d.getFullYear(), d.getMonth(), i));
        }

        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }
        while(weeks[weeks.length-1].length < 7) {
            weeks[weeks.length-1].push(null);
        }
        
        return { calendarWeeks: weeks, monthName: monthNameStr, year: d.getFullYear() };
    }, [viewDate]);


    const changeMonth = (offset: number) => {
      setViewDate(prevDate => {
          const newDate = new Date(prevDate);
          newDate.setDate(1); // Avoid month skipping issues
          newDate.setMonth(newDate.getMonth() + offset);
          return newDate;
      });
    };

    const isDateUnavailable = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return true;
        if (selectedProfessional?.unavailableDays.includes(date.getDay())) return true;
        return false;
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Select Professional
                return (
                    <div className="fade-in">
                        <h3 className="text-2xl font-semibold mb-6 text-center">Elige una profesional</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {TEAM.map(member => (
                                <button key={member.id} onClick={() => handleSelectProfessional(member)} className="text-left p-4 border rounded-lg hover:border-pitaya-pink hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-pitaya-pink focus:ring-offset-2">
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
                     <div className="fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                            {/* Calendar */}
                            <div className="w-full">
                                <h3 className="text-xl font-semibold mb-4 text-center">1. Elige una fecha</h3>
                                <div className="max-w-xs mx-auto bg-white p-4 rounded-lg border">
                                    <div className="flex justify-between items-center mb-4">
                                        <button onClick={() => changeMonth(-1)} aria-label="Mes anterior" className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pitaya-pink">&lt;</button>
                                        <h4 id="month-year-heading" className="font-semibold text-lg capitalize">{monthName} {year}</h4>
                                        <button onClick={() => changeMonth(1)} aria-label="Mes siguiente" className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pitaya-pink">&gt;</button>
                                    </div>
                                    <div role="grid" aria-labelledby="month-year-heading">
                                        <div role="row" className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
                                            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => <div key={i} role="columnheader">{day}</div>)}
                                        </div>
                                        {calendarWeeks.map((week, weekIndex) => (
                                            <div key={weekIndex} role="row" className="grid grid-cols-7 text-center">
                                                {week.map((date, dayIndex) => {
                                                    if (!date) return <div key={dayIndex} className="w-8 h-8 p-1"></div>;
                                                    const isUnavailable = isDateUnavailable(date);
                                                    return (
                                                        <div key={dayIndex} role="gridcell" className="p-1 flex items-center justify-center">
                                                            <button 
                                                                onClick={() => handleSelectDate(date.getDate())}
                                                                disabled={isUnavailable}
                                                                aria-disabled={isUnavailable}
                                                                aria-selected={selectedDate?.getTime() === date.getTime()}
                                                                aria-label={date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
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
                            </div>
                            {/* Time Slots */}
                            <div className="w-full">
                                <h3 className="text-xl font-semibold mb-4 text-center">2. Elige un horario</h3>
                                {selectedDate ? (
                                    <div className="fade-in max-h-80 overflow-y-auto pr-2">
                                        <h4 className="text-md font-semibold text-center mb-4">Disponibles para {selectedDate.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric' })}</h4>
                                        {availableTimes.length > 0 ? (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                {availableTimes.map(time => (
                                                    <button 
                                                        key={time} 
                                                        onClick={() => handleSelectTime(time)} 
                                                        className="p-3 border rounded-lg hover:bg-pitaya-pink hover:text-white transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-pitaya-pink"
                                                        aria-label={`Reservar a las ${time}`}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center text-gray-500 p-4 border-2 border-dashed rounded-lg">No hay horarios disponibles para este día con la duración requerida. Por favor, selecciona otra fecha.</p>
                                        )}
                                    </div>
                                ) : (
                                     <div className="text-center text-gray-500 p-8 border-2 border-dashed rounded-lg">
                                        <p>Por favor, selecciona una fecha en el calendario para ver los horarios.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 2: // Your Details
              return (
                <div className="fade-in max-w-md mx-auto">
                  <h3 className="text-2xl font-semibold mb-6 text-center">Completa tus datos</h3>
                  <form onSubmit={handleDetailsSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Nombre Completo</label>
                      <input type="text" id="name" name="name" value={clientDetails.name} onChange={handleDetailsChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Correo Electrónico</label>
                      <input type="email" id="email" name="email" value={clientDetails.email} onChange={handleDetailsChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink" required />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Teléfono</label>
                      <input type="tel" id="phone" name="phone" value={clientDetails.phone} onChange={handleDetailsChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink" required />
                    </div>
                    <button type="submit" className="w-full bg-pitaya-pink text-white font-semibold py-3 px-4 rounded-full hover:bg-opacity-90 transition transform hover:scale-105">
                      Revisar Cita
                    </button>
                  </form>
                </div>
              );
            case 3: // Review Details
              return (
                <div className="fade-in max-w-lg mx-auto">
                  <h3 className="text-2xl font-semibold mb-6 text-center">Revisa tu cita</h3>
                  <div className="bg-gray-50 p-6 rounded-lg shadow-inner border space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800">Servicios</h4>
                        <button onClick={onBack} className="text-sm text-pitaya-pink hover:underline focus:outline-none">Editar</button>
                      </div>
                      <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                        {services.map(s => <li key={s.id}>{s.name} (${s.price} MXN)</li>)}
                      </ul>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800">Profesional</h4>
                        <button onClick={() => goToStep(0)} className="text-sm text-pitaya-pink hover:underline focus:outline-none">Editar</button>
                      </div>
                      <p className="mt-1 text-gray-600">{selectedProfessional?.name}</p>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800">Fecha y Hora</h4>
                        <button onClick={() => goToStep(1)} className="text-sm text-pitaya-pink hover:underline focus:outline-none">Editar</button>
                      </div>
                      <p className="mt-1 text-gray-600">{selectedDate?.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} a las {selectedTime}</p>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800">Tus Datos</h4>
                        <button onClick={() => goToStep(2)} className="text-sm text-pitaya-pink hover:underline focus:outline-none">Editar</button>
                      </div>
                      <p className="mt-1 text-gray-600">{clientDetails.name}</p>
                      <p className="text-gray-600">{clientDetails.email}</p>
                      <p className="text-gray-600">{clientDetails.phone}</p>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="text-right">
                        <p className="font-bold text-lg"><strong className="text-gray-700">Total a pagar:</strong> ${totalPrice} MXN</p>
                    </div>
                  </div>
                  <button onClick={handleNextStep} className="mt-6 w-full bg-pitaya-pink text-white font-semibold py-3 px-4 rounded-full hover:bg-opacity-90 transition transform hover:scale-105">
                    Confirmar y Continuar al Pago
                  </button>
                </div>
              );
            case 4: // Payment
              return (
                <div className="fade-in max-w-lg mx-auto text-center">
                    <h3 className="text-2xl font-semibold mb-4">Resumen y Pago</h3>
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner border mb-6 text-left space-y-3">
                        <div>
                            <strong className="text-gray-700">Servicios:</strong>
                            <ul className="list-disc list-inside ml-2 text-sm">
                                {services.map(s => <li key={s.id}>{s.name}</li>)}
                            </ul>
                        </div>
                        <p><strong className="text-gray-700">Profesional:</strong> {selectedProfessional?.name}</p>
                        <p><strong className="text-gray-700">Fecha:</strong> {selectedDate?.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} a las {selectedTime}</p>
                        <p><strong className="text-gray-700">Cliente:</strong> {clientDetails.name}</p>
                        <p className="font-bold text-lg mt-4 border-t pt-2"><strong className="text-gray-700">Total:</strong> ${totalPrice} MXN</p>
                    </div>
                     <h4 className="text-lg font-semibold mb-4">Selecciona tu método de pago</h4>
                     <div className="space-y-4">
                         <button className="w-full flex items-center justify-center p-4 border rounded-lg hover:bg-gray-100 transition">
                            <img src="https://logolook.net/wp-content/uploads/2021/07/Mercado-Pago-Logo.png" alt="MercadoPago" className="h-6 mr-4"/> Pagar con MercadoPago
                         </button>
                         <button className="w-full flex items-center justify-center p-4 border rounded-lg hover:bg-gray-100 transition">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Oxxo_Logo.svg/1200px-Oxxo_Logo.svg.png" alt="Oxxo" className="h-6 mr-4"/> Pagar en OXXO Pay
                         </button>
                     </div>
                    <button onClick={handlePayment} disabled={isProcessing} className="mt-6 w-full inline-flex items-center justify-center bg-pitaya-pink text-white font-semibold py-3 px-10 rounded-full hover:bg-opacity-90 transition transform hover:scale-105 disabled:bg-opacity-70 disabled:cursor-not-allowed">
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Procesando pago...
                            </>
                        ) : ( `Pagar $${totalPrice} MXN` )}
                    </button>
                </div>
              );
            case 5: // Confirmation
              return (
                  <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200 fade-in">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <h3 className="text-2xl font-semibold text-green-800">¡Cita Confirmada!</h3>
                      <p className="text-green-700 mt-2 mb-6">Gracias, {clientDetails.name}. Hemos recibido tu pago y tu cita está confirmada. Recibirás un correo electrónico con todos los detalles.</p>
                      <div className="bg-white p-4 rounded-lg border text-left text-sm space-y-2">
                        <p><strong>Servicios:</strong> {services.map(s => s.name).join(', ')}</p>
                        <p><strong>Fecha:</strong> {selectedDate?.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} a las {selectedTime}</p>
                        <p><strong>Profesional:</strong> {selectedProfessional?.name}</p>
                      </div>
                      <button onClick={onBack} className="mt-6 bg-pitaya-pink text-white font-semibold py-2 px-6 rounded-full hover:bg-opacity-90 transition">
                          Reservar otra cita
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
            {currentStep < 5 && (
                <div className="flex items-center mb-8">
                    <button onClick={goBackStep} className="text-gray-600 hover:text-pitaya-pink transition mr-4 p-2 rounded-full hover:bg-gray-100" aria-label="Volver al paso anterior">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-pitaya-dark">{services.length > 1 ? `${services.length} Servicios Seleccionados` : services[0]?.name}</h2>
                      <p className="text-gray-500">{totalDuration} min • ${totalPrice} MXN</p>
                    </div>
                </div>
            )}

            {currentStep < 5 && (
                <div className="mb-8 px-4">
                    <div className="flex items-center">
                        {steps.slice(0, -1).map((step, index) => (
                            <React.Fragment key={index}>
                                <div className="flex flex-col items-center w-20">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${index <= currentStep ? 'bg-pitaya-pink text-white' : 'bg-gray-200 text-gray-500'}`}>
                                       {index < currentStep ? '✓' : index + 1}
                                    </div>
                                    <p className={`mt-2 text-xs text-center transition-colors duration-300 ${index <= currentStep ? 'text-pitaya-pink font-semibold' : 'text-gray-500'}`}>{step}</p>
                                </div>
                                {index < steps.length - 2 && <div className={`flex-grow h-1 mx-2 transition-colors duration-500 ${index < currentStep ? 'bg-pitaya-pink' : 'bg-gray-200'}`}></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            <div className="min-h-[400px] flex items-center justify-center">
                {renderStepContent()}
            </div>
        </div>
    );
};

export default BookingFlow;
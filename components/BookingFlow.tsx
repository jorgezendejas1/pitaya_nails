import React, { useState, useMemo, useEffect } from 'react';
import type { Service, TeamMember, BookingHistoryItem } from '../types';
import { 
    TEAM, 
    SALON_EMAIL_ADDRESS, 
    CalendarIcon, 
    UserIcon, 
    ClipboardListIcon, 
    PriceTagIcon,
    SlidersIcon,
    IdCardIcon,
    MagnifyingGlassIcon,
    ShieldCheckIcon
} from '../constants';

interface BookingFlowProps {
    services: Service[];
    onBack: () => void;
    initialCustomizations?: Record<string, { quantity: number; notes: string }>;
}

const BOOKING_STATE_KEY = 'pitayaNailsBookingState';
const BOOKING_HISTORY_KEY = 'pitayaNailsBookingHistory';


const loadBookingState = () => {
    try {
        const serializedState = localStorage.getItem(BOOKING_STATE_KEY);
        if (!serializedState) return undefined;
        const state = JSON.parse(serializedState);
        if (state.selectedDate) state.selectedDate = new Date(state.selectedDate);
        if (state.viewDate) state.viewDate = new Date(state.viewDate);
        return state;
    } catch (error) {
        console.error("Failed to load booking state from localStorage:", error);
        return undefined;
    }
};


const steps = ["Preferencias", "Profesional", "Fecha y Hora", "Tus Datos", "Revisar", "Confirmar", "Solicitud Enviada"];
const stepIcons = [
    <SlidersIcon />,
    <UserIcon />,
    <CalendarIcon />,
    <IdCardIcon />,
    <MagnifyingGlassIcon />,
    <ShieldCheckIcon />
];


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

const BookingFlow: React.FC<BookingFlowProps> = ({ services, onBack, initialCustomizations: initialCustomizationsFromProps }) => {
    const savedState = useMemo(() => loadBookingState(), []);

    const customizableServices = useMemo(() => services.filter(s => s.isCustomizable), [services]);
    
    const initialCustomizations = useMemo(() => {
        const base = Object.fromEntries(
            customizableServices.map(s => [s.id, { quantity: 1, notes: '' }])
        );
        // Merge with quantities passed from props
        if (initialCustomizationsFromProps) {
            for (const key in initialCustomizationsFromProps) {
                if (base[key]) {
                    base[key].quantity = initialCustomizationsFromProps[key].quantity;
                }
            }
        }
        return base;
    }, [customizableServices, initialCustomizationsFromProps]);


    const [currentStep, setCurrentStep] = useState(savedState?.currentStep ?? 0);
    const [selectedProfessional, setSelectedProfessional] = useState<TeamMember | null>(savedState?.selectedProfessional ?? null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(savedState?.selectedDate ?? null);
    const [selectedTime, setSelectedTime] = useState<string | null>(savedState?.selectedTime ?? null);
    const [clientDetails, setClientDetails] = useState(savedState?.clientDetails ?? { name: '', email: '', phone: '' });
    const [reminders, setReminders] = useState(savedState?.reminders ?? { email: true, sms: false });
    const [viewDate, setViewDate] = useState(savedState?.viewDate ?? new Date());
    const [isProcessing, setIsProcessing] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isLoadingTimes, setIsLoadingTimes] = useState(false);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

    
    const [customizations, setCustomizations] = useState<Record<string, { quantity: number; notes: string }>>(
        { ...initialCustomizations, ...(savedState?.customizations ?? {}) }
    );
    const [inspirationPhotos, setInspirationPhotos] = useState<File[]>([]);

    // Automatically set Lily as the professional
    useEffect(() => {
        const lily = TEAM.find(member => member.name === 'Lily');
        if (lily) {
            setSelectedProfessional(lily);
        }
    }, []);

    // Effect to save state to localStorage
    useEffect(() => {
        if (currentStep === 6) return; // Don't save on confirmation step
        const stateToSave = {
            currentStep,
            selectedProfessional,
            selectedDate,
            selectedTime,
            clientDetails,
            reminders,
            viewDate,
            customizations,
        };
        try {
            localStorage.setItem(BOOKING_STATE_KEY, JSON.stringify(stateToSave));
        } catch (error) {
            console.error("Failed to save booking state to localStorage:", error);
        }
    }, [currentStep, selectedProfessional, selectedDate, selectedTime, clientDetails, reminders, viewDate, customizations]);
    
    // Effect to clear state and save history after successful booking
    useEffect(() => {
        if (currentStep === 6) {
            localStorage.removeItem(BOOKING_STATE_KEY);
            saveBookingToHistory();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep]);


    const { totalPrice, totalDuration } = useMemo(() => {
        return services.reduce((acc, service) => {
            if (service.isCustomizable && customizations[service.id]) {
                const quantity = customizations[service.id].quantity || 1;
                acc.totalPrice += service.pricePerUnit ? service.price * quantity : service.price;
                acc.totalDuration += service.durationPerUnit ? service.duration * quantity : service.duration;
            } else {
                acc.totalPrice += service.price;
                acc.totalDuration += service.duration;
            }
            return acc;
        }, { totalPrice: 0, totalDuration: 0 });
    }, [services, customizations]);

    useEffect(() => {
        if (!selectedDate || !selectedProfessional) {
            setTimeSlots([]);
            return;
        }
    
        setIsLoadingTimes(true);
        // Simulate async fetch for a better UX, as this could be a real API call
        const timer = setTimeout(() => {
            const bookedSlots = [{ start: LUNCH_BREAK_START_MIN, end: LUNCH_BREAK_END_MIN }]; // Simulating booked slots
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
            setTimeSlots(availableSlots);
            setIsLoadingTimes(false);
        }, 500);
    
        return () => clearTimeout(timer);
    }, [selectedDate, selectedProfessional, totalDuration]);

    const handleNextStep = () => setCurrentStep(prev => {
        if (prev === 0) return 2; // From Preferences, skip professional selection to Date & Time
        return prev + 1;
    });

    const goToStep = (step: number) => {
        if (step < currentStep) {
            setSubmissionError(null);
            setCurrentStep(step);
        }
    }
    
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
        const { name, value } = e.target;
        setClientDetails(prev => ({ ...prev, [name]: value }));
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };
    
    const handleRemindersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReminders(prev => ({ ...prev, [e.target.name]: e.target.checked }));
    };

    const validateClientDetails = () => {
        const errors: { name?: string; email?: string; phone?: string } = {};
        const phoneRegex = /^\d+$/;

        if (!clientDetails.name.trim()) errors.name = "El nombre es obligatorio.";
        
        if (!clientDetails.email.trim()) {
            errors.email = "El correo es obligatorio.";
        } else if (!/\S+@\S+\.\S+/.test(clientDetails.email)) {
            errors.email = "El formato del correo no es válido.";
        }

        const phoneTrimmed = clientDetails.phone.trim();
        if (!phoneTrimmed) {
            errors.phone = "El teléfono es obligatorio.";
        } else if (!phoneRegex.test(phoneTrimmed)) {
            errors.phone = "El teléfono solo debe contener números.";
        } else if (phoneTrimmed.length < 10) {
            errors.phone = "El teléfono debe tener al menos 10 dígitos.";
        }
        
        return errors;
    };

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validateClientDetails();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        handleNextStep();
    };
    
    const handleCustomizationChange = (serviceId: string, field: 'quantity' | 'notes', value: string | number) => {
        setCustomizations(prev => ({
            ...prev,
            [serviceId]: { ...prev[serviceId], [field]: value }
        }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setInspirationPhotos(Array.from(e.target.files));
        }
    };
    
    const getAppointmentDateTime = () => {
        if (!selectedDate || !selectedTime) return null;
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const appointmentDate = new Date(selectedDate);
        appointmentDate.setHours(hours, minutes, 0, 0);
        return appointmentDate;
    };
    
    const saveBookingToHistory = () => {
        const appointmentDate = getAppointmentDateTime();
        if (!appointmentDate || !selectedProfessional) return;

        const newHistoryItem: BookingHistoryItem = {
            id: Date.now(),
            date: appointmentDate.toISOString(),
            services: services.map(s => ({ id: s.id, name: s.name })),
            professionalName: selectedProfessional.name,
            totalPrice,
            totalDuration,
        };

        try {
            const existingHistoryJson = localStorage.getItem(BOOKING_HISTORY_KEY);
            const existingHistory: BookingHistoryItem[] = existingHistoryJson ? JSON.parse(existingHistoryJson) : [];
            const updatedHistory = [newHistoryItem, ...existingHistory].slice(0, 5); // Keep last 5 appointments
            localStorage.setItem(BOOKING_HISTORY_KEY, JSON.stringify(updatedHistory));
        } catch (error) {
            console.error("Failed to save booking history:", error);
        }
    };


    const generateIcsFile = () => {
        const startDate = getAppointmentDateTime();
        if (!startDate || !selectedProfessional) return;
        
        const endDate = new Date(startDate.getTime() + totalDuration * 60000);

        const toVCalendarDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//PitayaNails//Appointment//ES',
            'BEGIN:VEVENT',
            `UID:${Date.now()}@pitayanails.com`,
            `DTSTAMP:${toVCalendarDate(new Date())}`,
            `DTSTART:${toVCalendarDate(startDate)}`,
            `DTEND:${toVCalendarDate(endDate)}`,
            'SUMMARY:Cita en Pitaya Nails',
            `DESCRIPTION:Tu cita para: ${services.map(s => s.name).join(', ')}. Con ${selectedProfessional.name}.`,
            'LOCATION:Pitaya Nails, Cancún, México',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'cita-pitaya-nails.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleConfirmAndSubmit = async () => {
        setSubmissionError(null);
        setIsProcessing(true);

        const resendApiKey = process.env.RESEND_API_KEY;

        const dateString = selectedDate?.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) || 'No especificada';
        const servicesListHtml = services.map(s => {
            if (customizations[s.id]) {
                return `<li>${s.name} (x${customizations[s.id].quantity})</li>`;
            }
            return `<li>${s.name}</li>`;
        }).join('');

        // Email to Salon Owner
        const salonEmailHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h1 style="color: #e04377;">Nueva Solicitud de Cita</h1>
                <p>Has recibido una nueva solicitud de cita a través del sitio web.</p>
                <h2>Detalles del Cliente:</h2>
                <ul>
                    <li><strong>Nombre:</strong> ${clientDetails.name}</li>
                    <li><strong>Email:</strong> ${clientDetails.email}</li>
                    <li><strong>Teléfono:</strong> ${clientDetails.phone}</li>
                </ul>
                <h2>Detalles de la Cita:</h2>
                <ul>
                    <li><strong>Profesional:</strong> ${selectedProfessional?.name}</li>
                    <li><strong>Fecha:</strong> ${dateString}</li>
                    <li><strong>Hora:</strong> ${selectedTime}</li>
                </ul>
                <h2>Servicios Solicitados:</h2>
                <ul>${servicesListHtml}</ul>
                <p><strong>Duración Total:</strong> ${totalDuration} minutos</p>
                <p><strong>Precio Total:</strong> $${totalPrice} MXN</p>
                <p>Por favor, contacta al cliente para confirmar la cita.</p>
            </div>
        `;
        
        // Email to Client
        const clientEmailHtml = `
             <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h1 style="color: #e04377;">¡Hemos recibido tu solicitud de cita, ${clientDetails.name}!</h1>
                <p>Gracias por elegir Pitaya Nails. Hemos recibido tu solicitud y pronto nos pondremos en contacto contigo para confirmar todos los detalles.</p>
                <h2>Resumen de tu Solicitud:</h2>
                <ul>
                    <li><strong>Profesional:</strong> ${selectedProfessional?.name}</li>
                    <li><strong>Fecha:</strong> ${dateString}</li>
                    <li><strong>Hora:</strong> ${selectedTime}</li>
                </ul>
                <h2>Servicios:</h2>
                <ul>${servicesListHtml}</ul>
                <p><strong>Total Estimado:</strong> $${totalPrice} MXN</p>
                <p>¡Nos vemos pronto!</p>
                <br>
                <p><em>El equipo de Pitaya Nails</em></p>
            </div>
        `;

        const sendEmail = (payload: object) => {
            return fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendApiKey}`,
                },
                body: JSON.stringify(payload),
            });
        };

        try {
            const salonEmailPayload = {
                from: 'Reservas <onboarding@resend.dev>', // Should be a verified domain in production
                to: [SALON_EMAIL_ADDRESS],
                subject: `Nueva Solicitud de Cita: ${clientDetails.name}`,
                html: salonEmailHtml,
            };
            
            const clientEmailPayload = {
                from: 'Pitaya Nails <onboarding@resend.dev>', // Should be a verified domain in production
                to: [clientDetails.email],
                subject: 'Tu solicitud de cita en Pitaya Nails',
                html: clientEmailHtml,
            };

            const [salonResponse, clientResponse] = await Promise.all([
                sendEmail(salonEmailPayload),
                sendEmail(clientEmailPayload)
            ]);

            if (salonResponse.ok && clientResponse.ok) {
                handleNextStep(); // Go to confirmation page
            } else {
                 const errorText = await salonResponse.text() + await clientResponse.text();
                 console.error("Resend API error:", errorText);
                 setSubmissionError("Hubo un error al enviar las notificaciones. Por favor, intenta de nuevo.");
            }
        } catch (error) {
            console.error("Network or other error:", error);
            setSubmissionError("Error de conexión. Por favor, revisa tu conexión a internet e intenta de nuevo.");
        } finally {
            setIsProcessing(false);
        }
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
          while(weeks[weeks.length-1].length < 7) weeks[weeks.length-1].push(null);
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
    }
    
    const isResendConfigured = !!process.env.RESEND_API_KEY;

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Preferences
                return (
                    <div className="fade-in max-w-lg mx-auto w-full">
                        <h3 className="text-2xl font-semibold mb-6 text-center font-serif">Preferencias y Detalles</h3>
                        <div className="space-y-8">
                            {customizableServices.map(service => (
                                <div key={service.id} className="p-4 border rounded-lg">
                                    <h4 className="font-bold text-lg text-pitaya-dark font-serif">{service.name}</h4>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label htmlFor={`quantity-${service.id}`} className="block text-sm font-semibold text-gray-700">{service.customizationPrompt}</label>
                                            <input 
                                                type="number" 
                                                id={`quantity-${service.id}`}
                                                value={customizations[service.id]?.quantity || 1}
                                                onChange={e => handleCustomizationChange(service.id, 'quantity', parseInt(e.target.value, 10))}
                                                min="1"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor={`notes-${service.id}`} className="block text-sm font-semibold text-gray-700">Colores o ideas preferidas (opcional)</label>
                                            <textarea 
                                                id={`notes-${service.id}`}
                                                rows={3}
                                                value={customizations[service.id]?.notes || ''}
                                                onChange={e => handleCustomizationChange(service.id, 'notes', e.target.value)}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink"
                                                placeholder="Ej: Tonos pastel, diseño de flores, etc."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                             <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-2 font-serif">Inspiración</h4>
                                <label htmlFor="inspiration-upload" className="block text-sm font-semibold text-gray-700">Sube fotos de diseños que te gusten (opcional)</label>
                                <input 
                                    type="file" 
                                    id="inspiration-upload" 
                                    multiple 
                                    accept="image/*" 
                                    onChange={handlePhotoUpload}
                                    className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pitaya-pink-light file:text-pitaya-pink hover:file:bg-pitaya-pink/20"
                                />
                                {inspirationPhotos.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-2">{inspirationPhotos.length} foto(s) seleccionada(s).</p>
                                )}
                            </div>
                        </div>
                        <button onClick={handleNextStep} className="mt-8 w-full bg-pitaya-pink text-white font-semibold py-3 px-4 rounded-full hover:bg-opacity-90 transition transform hover:scale-105">
                            Siguiente
                        </button>
                    </div>
                );
            case 1: // Select Professional - THIS STEP IS SKIPPED
                return null;
            case 2: // Select Date and Time
                return (
                    <div className="fade-in max-w-4xl mx-auto w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                            {/* Calendar Column */}
                            <div className="w-full">
                                <h3 className="text-xl font-semibold mb-4 text-center font-serif">Elige una fecha</h3>
                                <div className="max-w-xs mx-auto bg-white p-4 rounded-lg border">
                                    <div className="flex justify-between items-center mb-4">
                                        <button onClick={() => changeMonth(-1)} aria-label="Mes anterior" className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pitaya-pink">&lt;</button>
                                        <h4 id="month-year-heading" className="font-semibold text-lg capitalize font-serif">{monthName} {year}</h4>
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
                            
                            {/* Time Slots Column */}
                            <div className="w-full">
                                <h3 className="text-xl font-semibold mb-4 text-center font-serif">Elige un horario</h3>
                                <div className="bg-gray-50 p-4 rounded-lg border min-h-[410px]">
                                    {selectedDate ? (
                                        isLoadingTimes ? (
                                            <div className="flex flex-col justify-center items-center h-full text-gray-500 fade-in">
                                                <svg className="animate-spin h-8 w-8 text-pitaya-pink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                <p className="mt-3">Buscando horarios disponibles...</p>
                                            </div>
                                        ) : (
                                            <div className="fade-in max-h-[370px] overflow-y-auto pr-2">
                                                <h4 className="text-md font-semibold text-center mb-4 font-serif">Disponibles para {selectedDate.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric' })}</h4>
                                                {timeSlots.length > 0 ? (
                                                    <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                                                        {timeSlots.map(time => (
                                                            <button 
                                                                key={time} 
                                                                onClick={() => handleSelectTime(time)} 
                                                                className="p-3 border border-gray-300 rounded-lg bg-white text-pitaya-dark font-semibold hover:bg-pitaya-pink hover:text-white hover:border-pitaya-pink transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-pitaya-pink"
                                                                aria-label={`Reservar a las ${time}`}
                                                            >
                                                                {time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-pitaya-dark/70 p-6 bg-white rounded-lg border border-dashed">
                                                        <p>No hay horarios disponibles para este día. Por favor, selecciona otra fecha.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-center text-pitaya-dark/70 p-6 bg-white rounded-lg border border-dashed flex flex-col items-center justify-center h-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pitaya-pink/50 mb-3" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <p>Por favor, selecciona una fecha en el calendario para ver los horarios.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3: // Your Details
              return (
                <div className="fade-in max-w-md mx-auto">
                  <h3 className="text-2xl font-semibold mb-6 text-center font-serif">Completa tus datos</h3>
                  <form onSubmit={handleDetailsSubmit} className="space-y-4" noValidate>
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Nombre Completo</label>
                      <input type="text" id="name" name="name" value={clientDetails.name} onChange={handleDetailsChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`} required />
                      {formErrors.name && <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Correo Electrónico</label>
                      <input type="email" id="email" name="email" value={clientDetails.email} onChange={handleDetailsChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`} required />
                      {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Teléfono</label>
                      <input type="tel" id="phone" name="phone" value={clientDetails.phone} onChange={handleDetailsChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`} required />
                      {formErrors.phone && <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>}
                    </div>
                    <div className="pt-2">
                        <p className="block text-sm font-semibold text-gray-700">Recordatorios de Cita</p>
                        <div className="mt-2 space-y-2">
                            <label htmlFor="emailReminder" className="flex items-center cursor-pointer">
                                <input type="checkbox" id="emailReminder" name="email" checked={reminders.email} onChange={handleRemindersChange} className="h-4 w-4 rounded border-gray-300 text-pitaya-pink focus:ring-pitaya-pink" />
                                <span className="ml-2 text-sm text-gray-600">Enviarme un recordatorio por correo 24h antes</span>
                            </label>
                            <label htmlFor="smsReminder" className="flex items-center cursor-pointer">
                                <input type="checkbox" id="smsReminder" name="sms" checked={reminders.sms} onChange={handleRemindersChange} className="h-4 w-4 rounded border-gray-300 text-pitaya-pink focus:ring-pitaya-pink" />
                                <span className="ml-2 text-sm text-gray-600">Enviarme un recordatorio por SMS 24h antes</span>
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-pitaya-pink text-white font-semibold py-3 px-4 rounded-full hover:bg-opacity-90 transition transform hover:scale-105 !mt-6">
                      Revisar Cita
                    </button>
                  </form>
                </div>
              );
            case 4: // Review Details
              const handleBackAndClear = () => {
                localStorage.removeItem(BOOKING_STATE_KEY);
                onBack();
              };
              return (
                <div className="fade-in max-w-lg mx-auto">
                  <h3 className="text-2xl font-semibold mb-6 text-center font-serif">Revisa tu cita</h3>
                  <div className="bg-gray-50 p-6 rounded-lg shadow-inner border space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800 font-serif">Servicios</h4>
                        <button onClick={handleBackAndClear} className="text-sm text-pitaya-pink hover:underline focus:outline-none">Editar</button>
                      </div>
                      <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                        {services.map(s => <li key={s.id}>{s.name} {customizations[s.id] ? `(x${customizations[s.id].quantity})` : ''} - ${s.pricePerUnit ? s.price * (customizations[s.id]?.quantity || 1) : s.price} MXN</li>)}
                      </ul>
                    </div>
                    <div className="border-t border-gray-200"></div>
                     <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800 font-serif">Preferencias</h4>
                        <button onClick={() => goToStep(0)} className="text-sm text-pitaya-pink hover:underline focus:outline-none">Editar</button>
                      </div>
                      {customizableServices.map(s => (
                        customizations[s.id]?.notes && <p key={s.id} className="mt-1 text-sm text-gray-600"><strong>Notas para {s.name}:</strong> {customizations[s.id].notes}</p>
                      ))}
                      {inspirationPhotos.length > 0 && <p className="mt-1 text-sm text-gray-600"><strong>Inspiración:</strong> {inspirationPhotos.length} foto(s) subida(s)</p>}
                       {customizableServices.length === 0 && inspirationPhotos.length === 0 && <p className="mt-1 text-sm text-gray-500">Sin preferencias adicionales.</p>}
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800 font-serif">Profesional</h4>
                      </div>
                      <p className="mt-1 text-gray-600">{selectedProfessional?.name}</p>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800 font-serif">Fecha y Hora</h4>
                        <button onClick={() => goToStep(2)} className="text-sm text-pitaya-pink hover:underline focus:outline-none">Editar</button>
                      </div>
                      <p className="mt-1 text-gray-600">{selectedDate?.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} a las {selectedTime}</p>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div>
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800 font-serif">Tus Datos</h4>
                        <button onClick={() => goToStep(3)} className="text-sm text-pitaya-pink hover:underline focus:outline-none">Editar</button>
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
                    Continuar para Confirmar
                  </button>
                </div>
              );
            case 5: // Confirm
              return (
                <div className="fade-in max-w-lg mx-auto text-center">
                    <h3 className="text-2xl font-semibold mb-4 font-serif">Confirmar Solicitud</h3>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6 text-left space-y-6">

                        {/* Services Section */}
                        <div className="flex items-start gap-4">
                            <div className="bg-pitaya-pink-light p-2 rounded-full">
                                <ClipboardListIcon className="w-6 h-6 text-pitaya-pink" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">Servicios</h4>
                                <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                                    {services.map(s => <li key={s.id}>{s.name} {customizations[s.id] ? `(x${customizations[s.id].quantity})` : ''}</li>)}
                                </ul>
                            </div>
                        </div>

                        {/* Professional Section */}
                        <div className="flex items-start gap-4">
                            <div className="bg-pitaya-pink-light p-2 rounded-full">
                                <UserIcon className="w-6 h-6 text-pitaya-pink" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">Profesional</h4>
                                <p className="mt-1 text-sm text-gray-600">{selectedProfessional?.name}</p>
                            </div>
                        </div>
                        
                        {/* Date & Time Section */}
                        <div className="flex items-start gap-4">
                            <div className="bg-pitaya-pink-light p-2 rounded-full">
                                <CalendarIcon className="w-6 h-6 text-pitaya-pink" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">Fecha y Hora</h4>
                                <p className="mt-1 text-sm text-gray-600">{selectedDate?.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} a las {selectedTime}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200"></div>

                        {/* Total Section */}
                        <div className="flex items-start gap-4">
                            <div className="bg-pitaya-pink-light p-2 rounded-full">
                                <PriceTagIcon className="w-6 h-6 text-pitaya-pink" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">Total a Pagar</h4>
                                <p className="text-lg font-bold text-pitaya-dark mt-1">${totalPrice} MXN</p>
                            </div>
                        </div>

                    </div>
                     {!isResendConfigured ? (
                       <p className="text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                           <strong>Atención:</strong> La reserva de citas está desactivada. El dueño del sitio necesita configurar la clave de API de Resend.
                       </p>
                     ) : (
                        submissionError && <p className="text-red-600 text-sm mb-4">{submissionError}</p>
                     )}
                    <button 
                        onClick={handleConfirmAndSubmit} 
                        disabled={isProcessing || !isResendConfigured} 
                        className="mt-6 w-full inline-flex items-center justify-center bg-pitaya-pink text-white font-semibold py-3 px-10 rounded-full hover:bg-opacity-90 transition transform hover:scale-105 disabled:bg-opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Enviando solicitud...
                            </>
                        ) : (
                            'Confirmar y Enviar Solicitud'
                        )}
                    </button>
                </div>
              );
            case 6: // Confirmation
              return (
                  <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200 fade-in">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <h3 className="text-2xl font-semibold text-green-800 font-serif">¡Solicitud de Cita Enviada!</h3>
                      <p className="text-green-700 mt-2 mb-6">Gracias, {clientDetails.name}. Hemos recibido tu solicitud. Te contactaremos por correo o WhatsApp para confirmar tu cita. ¡Nos vemos pronto!</p>
                      <div className="bg-white p-4 rounded-lg border text-left text-sm space-y-2 mb-6">
                        <p><strong>Servicios:</strong> {services.map(s => s.name).join(', ')}</p>
                        <p><strong>Fecha:</strong> {selectedDate?.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} a las {selectedTime}</p>
                        <p><strong>Profesional:</strong> {selectedProfessional?.name}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                         <button onClick={generateIcsFile} className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-700 transition">
                            Añadir al Calendario
                        </button>
                        <button onClick={onBack} className="bg-pitaya-pink text-white font-semibold py-2 px-6 rounded-full hover:bg-opacity-90 transition">
                            Reservar otra cita
                        </button>
                      </div>
                  </div>
              );
            default: return null;
        }
    };
    
    const goBackStep = () => {
       if (currentStep > 0) {
           let newStep = currentStep - 1;
           if (newStep === 1) { // If going back to step 1 (Professional), which is now skipped
               newStep = 0; // Go to step 0 (Preferences) instead
           }
           goToStep(newStep);
       } else {
           localStorage.removeItem(BOOKING_STATE_KEY);
           onBack();
       }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 md:p-12 rounded-xl shadow-2xl border border-gray-100">
            {currentStep < 6 && (
                <div className="flex items-center mb-8">
                    <button onClick={goBackStep} className="text-gray-600 hover:text-pitaya-pink transition mr-4 p-2 rounded-full hover:bg-gray-100" aria-label="Volver al paso anterior">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-pitaya-dark font-serif">{services.length > 1 ? `${services.length} Servicios Seleccionados` : services[0]?.name}</h2>
                      <p className="text-gray-500">{totalDuration} min • ${totalPrice} MXN</p>
                    </div>
                </div>
            )}

            {currentStep < 6 && (
                <div className="mb-12 relative">
                    {/* Background line */}
                    <div 
                        className="absolute top-5 h-1 bg-gray-200"
                        style={{ left: 'calc(100% / 12)', width: 'calc(100% * 10 / 12)' }}
                        aria-hidden="true"
                    ></div>
                    {/* Active progress line */}
                    <div 
                        className="absolute top-5 h-1 bg-pitaya-pink transition-all duration-500"
                        style={{
                            left: 'calc(100% / 12)',
                            width: `calc((100% * 10 / 12) * ${currentStep / (steps.length - 2)})` 
                        }}
                    ></div>

                    <div className="grid grid-cols-6 relative">
                        {steps.slice(0, -1).map((step, index) => {
                            const isCompleted = index < currentStep;
                            const isCurrent = index === currentStep;
                            return (
                                <button
                                    key={index}
                                    onClick={() => goToStep(index)}
                                    disabled={!isCompleted}
                                    className={`flex flex-col items-center text-center z-10 px-1 min-w-0 group focus:outline-none ${isCompleted ? 'cursor-pointer' : 'cursor-default'}`}
                                    aria-label={`Ir al paso: ${step}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isCompleted ? 'bg-pitaya-pink text-white group-hover:bg-opacity-80' : 
                                        isCurrent ? 'bg-pitaya-pink text-white scale-110 shadow-lg ring-4 ring-pitaya-pink/30' : 
                                        'bg-white text-gray-400 border-2 border-gray-300'
                                    }`}>
                                    {isCompleted ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        React.cloneElement(stepIcons[index], { className: `h-5 w-5 ${isCurrent ? 'text-white' : 'text-gray-400'}` })
                                    )}
                                    </div>
                                    <p className={`mt-2 text-xs break-words font-semibold transition-colors duration-300 ${
                                        isCurrent ? 'text-pitaya-pink' : 
                                        isCompleted ? 'text-gray-700' : 
                                        'text-gray-500'
                                    }`}>{step}</p>
                                </button>
                            );
                        })}
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
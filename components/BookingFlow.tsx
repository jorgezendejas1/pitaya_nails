
import React, { useState } from 'react';
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

    const availableTimes = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

    const handleSelectProfessional = (professional: TeamMember) => {
        setSelectedProfessional(professional);
        setCurrentStep(1);
    };

    const handleSelectDateTime = (time: string) => {
        // For simplicity, we'll use today's date
        setSelectedDate(new Date()); 
        setSelectedTime(time);
        setCurrentStep(2);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div>
                        <h3 className="text-2xl font-semibold mb-6 text-center">Elige una profesional</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {TEAM.map(member => (
                                <button key={member.id} onClick={() => handleSelectProfessional(member)} className="text-left p-4 border rounded-lg hover:border-pitaya-pink hover:shadow-lg transition">
                                    <img src={member.imageUrl} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
                                    <h4 className="font-bold text-center text-lg">{member.name}</h4>
                                    <p className="text-center text-sm text-gray-500">{member.role}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <h3 className="text-2xl font-semibold mb-6 text-center">Elige fecha y hora</h3>
                        <p className="text-center mb-6 text-gray-600">Mostrando horarios disponibles para hoy. <br/>Para otras fechas, por favor continúa al calendario de Google.</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-md mx-auto">
                            {availableTimes.map(time => (
                                <button key={time} onClick={() => handleSelectDateTime(time)} className="p-3 border rounded-lg hover:bg-pitaya-pink hover:text-white transition">
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold mb-4">Confirma tu cita</h3>
                        <div className="bg-white p-6 rounded-lg shadow-inner border max-w-md mx-auto space-y-3">
                            <p><strong className="text-gray-700">Servicio:</strong> {service.name}</p>
                            <p><strong className="text-gray-700">Profesional:</strong> {selectedProfessional?.name}</p>
                            <p><strong className="text-gray-700">Fecha:</strong> {selectedDate?.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p><strong className="text-gray-700">Hora:</strong> {selectedTime}</p>
                            <p className="font-bold text-lg mt-4"><strong className="text-gray-700">Total:</strong> ${service.price} MXN</p>
                        </div>
                        <p className="mt-6 text-gray-600">Serás redirigido a Google Calendar para finalizar tu reservación.</p>
                        <a 
                            href={BOOKING_LINK}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-4 inline-block bg-pitaya-pink text-white font-bold py-3 px-10 rounded-full hover:bg-opacity-90 transition transform hover:scale-105"
                        >
                            Finalizar en Google Calendar
                        </a>
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
                <button onClick={goBackStep} className="text-gray-600 hover:text-pitaya-pink transition mr-4">
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
                        <div key={index} className="flex items-center flex-grow">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center transition ${index <= currentStep ? 'bg-pitaya-pink text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {index + 1}
                            </div>
                            <p className={`ml-2 font-semibold transition ${index <= currentStep ? 'text-pitaya-pink' : 'text-gray-500'}`}>{step}</p>
                            {index < steps.length - 1 && <div className={`flex-grow h-1 mx-4 transition ${index < currentStep ? 'bg-pitaya-pink' : 'bg-gray-200'}`}></div>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="min-h-[300px]">
                {renderStepContent()}
            </div>
        </div>
    );
};

export default BookingFlow;

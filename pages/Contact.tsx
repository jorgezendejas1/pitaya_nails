import React, { useState } from 'react';
// FIX: Import the missing FORMSPREE_ENDPOINT constant.
import { WHATSAPP_LINK, INSTAGRAM_LINK, FORMSPREE_ENDPOINT, InstagramIcon, WhatsAppIcon } from '../constants';
import InteractiveMap from '../components/InteractiveMap';

const Contact: React.FC = () => {
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear the error for this field when the user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors: { name?: string; email?: string; message?: string } = {};
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es obligatorio.';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El formato del email no es válido.';
        }
        if (!formData.message.trim()) {
            newErrors.message = 'El mensaje es obligatorio.';
        }
        return newErrors;
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Stop submission if there are errors
        }

        setSubmissionStatus('submitting');
        const formElement = event.currentTarget;
        const formSpreeData = new FormData(formElement);

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formSpreeData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setSubmissionStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setErrors({});
                formElement.reset();
            } else {
                setSubmissionStatus('error');
            }
        } catch (error) {
            setSubmissionStatus('error');
        }
    };


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-pitaya-dark font-serif">Contáctanos</h1>
                <p className="text-lg text-pitaya-dark/70 mt-2">¿Tienes alguna pregunta? Estamos aquí para ayudarte.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-pitaya-dark font-serif">Envíanos un mensaje</h2>
                    
                    {submissionStatus === 'success' ? (
                         <div className="text-center p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
                            <h3 className="font-semibold text-lg">¡Mensaje Enviado!</h3>
                            <p className="mt-1">Gracias por contactarnos. Te responderemos pronto.</p>
                        </div>
                    ) : (
                        <>
                            {FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID') && (
                               <p className="text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                                   <strong>Atención:</strong> Para activar este formulario, necesitas reemplazar <code>YOUR_FORM_ID</code> en el archivo <code>constants.tsx</code> con tu ID de Formspree.
                               </p>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Nombre</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        value={formData.name}
                                        onChange={handleChange}
                                        required 
                                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink ${errors.name ? 'border-red-500' : 'border-gray-300'}`} 
                                    />
                                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required 
                                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink ${errors.email ? 'border-red-500' : 'border-gray-300'}`} 
                                    />
                                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700">Mensaje</label>
                                    <textarea 
                                        id="message" 
                                        name="message" 
                                        rows={5} 
                                        value={formData.message}
                                        onChange={handleChange}
                                        required 
                                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                                    ></textarea>
                                    {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
                                </div>
                                <div>
                                    <button 
                                        type="submit" 
                                        disabled={submissionStatus === 'submitting'}
                                        className="w-full inline-flex items-center justify-center bg-pitaya-pink text-white font-semibold py-3 px-4 rounded-full hover:bg-opacity-90 transition duration-300 disabled:bg-opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submissionStatus === 'submitting' ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Enviando...
                                            </>
                                        ) : (
                                            'Enviar Mensaje'
                                        )}
                                    </button>
                                </div>
                                {submissionStatus === 'error' && (
                                    <p className="text-red-600 text-sm text-center mt-2">Hubo un error al enviar el mensaje. Por favor, intenta de nuevo más tarde.</p>
                                )}
                            </form>
                        </>
                    )}
                </div>
                <div className="space-y-8">
                     <div>
                        <h2 className="text-2xl font-bold mb-4 text-pitaya-dark font-serif">Información Directa</h2>
                        <div className="space-y-4">
                             <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center text-lg text-pitaya-dark/90 hover:text-pitaya-pink transition">
                                <WhatsAppIcon className="w-6 h-6 mr-3 text-pitaya-pink" />
                                +52 984 112 3411 (Click para chatear)
                            </a>
                             <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center text-lg text-pitaya-dark/90 hover:text-pitaya-pink transition">
                                <InstagramIcon className="w-6 h-6 mr-3 text-pitaya-pink" />
                                @nailstation_cun
                            </a>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-pitaya-dark font-serif">Nuestra Ubicación</h2>
                        <div className="h-96 rounded-lg overflow-hidden shadow-lg">
                           <InteractiveMap lat={21.1067629} lng={-86.8854156} zoom={15} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
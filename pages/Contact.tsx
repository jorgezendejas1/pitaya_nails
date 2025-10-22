import React, { useState } from 'react';
import { WHATSAPP_LINK, INSTAGRAM_LINK, FORMSPREE_ENDPOINT, InstagramIcon, WhatsAppIcon } from '../constants';
import InteractiveMap from '../components/InteractiveMap';

const Contact: React.FC = () => {
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmissionStatus('submitting');
        const formData = new FormData(event.currentTarget);

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setSubmissionStatus('success');
                event.currentTarget.reset();
            } else {
                // Formspree returns error details in JSON
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
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Nombre</label>
                                    <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
                                    <input type="email" id="email" name="_replyto" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700">Mensaje</label>
                                    <textarea id="message" name="message" rows={5} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink"></textarea>
                                </div>
                                <div>
                                    <button 
                                        type="submit" 
                                        disabled={submissionStatus === 'submitting'}
                                        className="w-full bg-pitaya-pink text-white font-semibold py-3 px-4 rounded-full hover:bg-opacity-90 transition duration-300 disabled:bg-opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submissionStatus === 'submitting' ? 'Enviando...' : 'Enviar Mensaje'}
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
                           <InteractiveMap lat={21.1619} lng={-86.8515} zoom={13} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
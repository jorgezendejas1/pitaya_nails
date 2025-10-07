
import React from 'react';
import { WHATSAPP_LINK, INSTAGRAM_LINK, InstagramIcon, WhatsAppIcon } from '../constants';

const Contact: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
    };
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Contáctanos</h1>
                <p className="text-lg text-gray-600 mt-2">¿Tienes alguna pregunta? Estamos aquí para ayudarte.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input type="text" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
                            <textarea id="message" rows={5} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pitaya-pink focus:border-pitaya-pink"></textarea>
                        </div>
                        <div>
                            <button type="submit" className="w-full bg-pitaya-pink text-white font-semibold py-3 px-4 rounded-md hover:bg-opacity-90 transition duration-300">
                                Enviar Mensaje
                            </button>
                        </div>
                    </form>
                </div>
                <div className="space-y-8">
                     <div>
                        <h2 className="text-2xl font-bold mb-4">Información de Contacto</h2>
                        <div className="space-y-4">
                             <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center text-lg text-gray-700 hover:text-pitaya-pink transition">
                                <WhatsAppIcon className="w-6 h-6 mr-3 text-pitaya-pink" />
                                +52 984 112 3411 (Click para chatear)
                            </a>
                             <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center text-lg text-gray-700 hover:text-pitaya-pink transition">
                                <InstagramIcon className="w-6 h-6 mr-3 text-pitaya-pink" />
                                @pitaya_nails
                            </a>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Nuestra Ubicación</h2>
                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                           <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d238132.6713879288!2d-86.99120614392436!3d21.1213322199049!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4c2b05a5853325%3A0x8603387d544b6797!2sCanc%C3%BAn%2C%20Q.R.%2C%20Mexico!5e0!3m2!1sen!2sus!4v1684351212345!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

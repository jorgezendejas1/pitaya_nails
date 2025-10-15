import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
    return (
        <div className="bg-pitaya-beige">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <img src="https://picsum.photos/seed/salon-interior/800/600" alt="Interior de Pitaya Nails" className="rounded-lg shadow-2xl" />
                    </div>
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold text-pitaya-dark">Nuestra Historia</h1>
                        <p className="text-pitaya-gold text-xl font-semibold mt-2 mb-6">Pasión por la perfección</p>
                        <div className="space-y-4 text-lg text-pitaya-dark/80">
                            <p>
                                Pitaya Nails nació del sueño de crear un espacio único en Cancún, donde la belleza de las uñas se eleva a la categoría de arte. Fundado por Lily, una apasionada del diseño y la perfección, nuestro salón es un refugio para quienes buscan calidad, creatividad y un servicio excepcional.
                            </p>
                            <p>
                                Nuestra filosofía se centra en el detalle. Creemos que cada uña es un lienzo en blanco y cada clienta una inspiración. Utilizamos solo productos de la más alta calidad y nos mantenemos a la vanguardia de las últimas tendencias y técnicas para ofrecerte resultados que no solo embellecen, sino que también cuidan la salud de tus uñas.
                            </p>
                            <p>
                                Más que un salón, queremos que Pitaya Nails sea tu momento, un lugar donde te sientas cómoda, consentida y salgas renovada y con una obra de arte en tus manos.
                            </p>
                        </div>
                         <Link
                            to="/servicios"
                            className="mt-8 inline-block bg-pitaya-pink text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Vive la Experiencia
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
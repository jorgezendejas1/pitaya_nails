
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, TESTIMONIALS } from '../constants';
import ServiceCard from '../components/ServiceCard';
import CallToActionBanner from '../components/CallToActionBanner';

const Home: React.FC = () => {
  const featuredServices = SERVICES.slice(0, 3);
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="space-y-20 md:space-y-28 pb-16">
      {/* Hero Section */}
      <section
        className="relative h-[70vh] md:h-[90vh] flex items-center justify-center text-white overflow-hidden"
      >
        <div 
          className="absolute top-[-5%] left-0 w-full h-[110%] bg-cover bg-center z-0 will-change-transform"
          style={{ 
            backgroundImage: "url('https://picsum.photos/seed/nail-salon-4k/1920/1080')",
            transform: `scale(${1 + offsetY * 0.00015}) translateY(${offsetY * 0.3}px)` 
          }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 reveal-on-scroll">
            Arte en uñas con el toque de Pitaya Nails — Cancún
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 reveal-on-scroll" style={{ transitionDelay: '100ms' }}>
            Manicure, pedicure y nail art con atención personalizada por Lily y su equipo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center reveal-on-scroll" style={{ transitionDelay: '200ms' }}>
            <Link
              to="/servicios"
              className="bg-pitaya-pink text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Reservar ahora
            </Link>
            <Link
              to="/servicios"
              className="bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3 rounded-full hover:bg-white/30 transition duration-300 transform hover:scale-105"
            >
              Ver servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
       <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-40 md:-mt-48 relative z-20 reveal-on-scroll">
            <CallToActionBanner 
                title="¿Lista para consentirte?"
                subtitle="Tus manos merecen lo mejor. Agenda tu cita hoy y déjanos transformar tus uñas en una obra de arte."
                buttonText="Ver Servicios y Agendar"
                buttonLink="/servicios"
            />
       </section>


      {/* Featured Services Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold text-pitaya-dark">Servicios Destacados</h2>
          <p className="text-lg text-pitaya-dark/70 mt-2">Descubre nuestros tratamientos más populares.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service, index) => (
            <div key={service.id} className="reveal-on-scroll" style={{ transitionDelay: `${index * 100}ms`}}>
                <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-pitaya-beige py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-pitaya-dark">Lo que dicen nuestras clientas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-pitaya-pearl p-8 rounded-lg shadow-md border-t-4 border-pitaya-gold reveal-on-scroll" style={{ transitionDelay: `${index * 100}ms`}}>
                <p className="text-pitaya-dark/80 italic mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold text-pitaya-dark text-right">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

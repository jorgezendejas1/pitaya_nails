import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, TESTIMONIALS } from '../constants';
import ServiceCard from '../components/ServiceCard';
import CallToActionBanner from '../components/CallToActionBanner';

const Home: React.FC = () => {
  const featuredServices = SERVICES.slice(0, 3);

  return (
    <div className="space-y-20 md:space-y-28 pb-16">
      {/* Hero Section */}
      <section
        className="relative h-[70vh] md:h-[90vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('https://picsum.photos/seed/nail-salon-4k/1920/1080')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 fade-in" style={{ animationDelay: '0.2s' }}>
            Arte en uñas con el toque de Pitaya Nails — Cancún
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 fade-in" style={{ animationDelay: '0.4s' }}>
            Manicure, pedicure y nail art con atención personalizada por Lily y su equipo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in" style={{ animationDelay: '0.6s' }}>
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
       <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-40 md:-mt-48 relative z-20">
            <CallToActionBanner 
                title="¿Lista para consentirte?"
                subtitle="Tus manos merecen lo mejor. Agenda tu cita hoy y déjanos transformar tus uñas en una obra de arte."
                buttonText="Ver Servicios y Agendar"
                buttonLink="/servicios"
            />
       </section>


      {/* Featured Services Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-pitaya-dark">Servicios Destacados</h2>
          <p className="text-lg text-pitaya-dark/70 mt-2">Descubre nuestros tratamientos más populares.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-pitaya-beige py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-pitaya-dark">Lo que dicen nuestras clientas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-pitaya-pearl p-8 rounded-lg shadow-md border-t-4 border-pitaya-gold">
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
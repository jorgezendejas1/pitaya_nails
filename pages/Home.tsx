
import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, TESTIMONIALS, CalendarIcon } from '../constants';
import ServiceCard from '../components/ServiceCard';
import VisitUs from '../components/VisitUs';
import DesignGallery from '../components/DesignGallery';

const Home: React.FC = () => {
  const featuredServices = SERVICES.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-[70vh] md:h-[90vh] flex items-center justify-center text-pitaya-pearl overflow-hidden"
      >
        <div 
            className="absolute inset-0 bg-cover bg-center hero-image-reveal"
            style={{ backgroundImage: "url('https://picsum.photos/seed/elegant-manicure/1920/1080')" }}
        ></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-pitaya-pearl/20 to-transparent"></div>
        <div className="relative z-10 text-center p-4">
          <h1 className="text-5xl md:text-7xl font-serif font-semibold leading-tight mb-4" style={{textShadow: '0 2px 4px rgba(0,0,0,0.4)'}}>
            Belleza en cada detalle
          </h1>
          <p className="text-lg md:text-xl max-w-xl mx-auto mb-8 text-pitaya-pearl/90" style={{textShadow: '0 1px 3px rgba(0,0,0,0.4)'}}>
            Studio de uñas premium donde el arte se encuentra con la elegancia
          </p>
          <div className="flex justify-center">
            <Link
              to="/servicios"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-pitaya-pink to-fuchsia-500 text-white font-semibold px-8 py-3 rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <CalendarIcon className="w-5 h-5" />
              <span>Reserva tu Cita</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-pitaya-dark font-serif">Servicios Destacados</h2>
          <p className="text-lg text-pitaya-dark/70 mt-2">Descubre nuestros tratamientos más populares.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Design Gallery Section */}
      <DesignGallery />

      {/* Testimonials Section */}
      <section className="bg-pitaya-beige py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-pitaya-dark font-serif">Lo que dicen nuestras clientas</h2>
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

      {/* Visit Us Section */}
      <VisitUs />
    </div>
  );
};

export default Home;

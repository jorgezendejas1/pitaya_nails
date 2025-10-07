
import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, TESTIMONIALS } from '../constants';
import ServiceCard from '../components/ServiceCard';

const Home: React.FC = () => {
  const featuredServices = SERVICES.slice(0, 3);

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] md:h-[80vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('https://picsum.photos/seed/nail-salon/1920/1080')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 animate-fade-in-down">
            Arte en uñas con actitud
          </h1>
          <p className="text-lg md:text-2xl mb-8 animate-fade-in-up">
            Reserva en un clic
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-300">
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

      {/* Featured Services Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Servicios Destacados</h2>
          <p className="text-lg text-gray-600 mt-2">Descubre nuestros tratamientos más populares.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Lo que dicen nuestras clientas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md border-t-4 border-pitaya-pink">
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold text-gray-800 text-right">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

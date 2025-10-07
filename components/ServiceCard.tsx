
import React from 'react';
import type { Service } from '../types';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
      <img src={service.imageUrl} alt={service.name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>{service.duration} min</span>
          <span className="font-bold text-pitaya-pink text-lg">${service.price} MXN</span>
        </div>
        <Link
          to={`/servicios?service=${service.id}`}
          className="block w-full text-center bg-pitaya-pink text-white font-semibold py-2 rounded-full hover:bg-opacity-90 transition duration-300 transform group-hover:scale-105"
        >
          Reservar ahora
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;


import React, { useState, useMemo } from 'react';
import { PORTFOLIO_IMAGES, PORTFOLIO_CATEGORIES } from '../constants';

const Portfolio: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const filteredImages = useMemo(() => {
        if (activeFilter === 'Todos') {
            return PORTFOLIO_IMAGES;
        }
        return PORTFOLIO_IMAGES.filter(image => image.category === activeFilter);
    }, [activeFilter]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Nuestro Trabajo</h1>
                <p className="text-lg text-gray-600 mt-2">Inspírate con algunos de nuestros diseños favoritos.</p>
            </div>

            <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
                {PORTFOLIO_CATEGORIES.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveFilter(category)}
                        className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition duration-300 ${activeFilter === category ? 'bg-pitaya-pink text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="masonry">
                {filteredImages.map((image) => (
                    <div key={image.id} className="masonry-item" onClick={() => setSelectedImage(image.src)}>
                        <img 
                            src={image.src} 
                            alt={image.alt} 
                            className="rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer w-full" 
                        />
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <img 
                        src={selectedImage} 
                        alt="Diseño de uñas en grande" 
                        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                     <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 text-white text-3xl font-bold"
                    >
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};

export default Portfolio;

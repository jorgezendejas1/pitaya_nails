import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PORTFOLIO_IMAGES, MagnifyingGlassIcon } from '../constants';

const DesignGallery: React.FC = () => {
    // Show a preview of the first 4 images
    const featuredImages = PORTFOLIO_IMAGES.slice(0, 4);
    const galleryRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If the container is intersecting the viewport, set visibility to true
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Once visible, we don't need to observe it anymore
                    if (galleryRef.current) {
                        observer.unobserve(galleryRef.current);
                    }
                }
            },
            {
                root: null, // observing relative to the viewport
                rootMargin: '0px',
                threshold: 0.1 // Trigger when 10% of the element is visible
            }
        );

        const currentRef = galleryRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);


    return (
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-pitaya-dark font-serif">Galería de Diseños</h2>
                    <p className="text-lg text-pitaya-dark/70 mt-2">Algunos de nuestros mejores trabajos</p>
                </div>
                <div ref={galleryRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredImages.map((image, index) => (
                        <Link 
                            to={`/portafolio?category=${image.category}`} 
                            key={image.id} 
                            className={`
                                relative group block rounded-lg overflow-hidden shadow-lg hover:shadow-2xl 
                                transition-all duration-500 ease-out
                                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
                            `}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <img 
                                src={image.src} 
                                alt={image.alt}
                                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-300" 
                            />
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <MagnifyingGlassIcon className="w-8 h-8 mb-2" />
                                <p className="text-sm font-semibold">Ver Diseño</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link
                        to="/portafolio"
                        className={`
                            inline-block bg-pitaya-pink text-white font-semibold px-8 py-3 rounded-full 
                            hover:bg-opacity-90 transition-all duration-500 ease-out transform hover:scale-105 shadow-md
                            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
                        `}
                        style={{ transitionDelay: '600ms' }}
                    >
                        Ver Portafolio Completo
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default DesignGallery;

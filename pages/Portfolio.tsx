
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PORTFOLIO_IMAGES, PORTFOLIO_CATEGORIES } from '../constants';
import type { PortfolioImage } from '../types';

// Icon for Masonry View
const MasonryIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="8" height="8"></rect>
        <rect x="3" y="13" width="8" height="8"></rect>
        <rect x="13" y="3" width="8" height="18"></rect>
    </svg>
);

// Icon for Grid View
const GridIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

const ImageLightbox: React.FC<{
    image: PortfolioImage;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    hasNavigation: boolean;
}> = ({ image, onClose, onNext, onPrev, hasNavigation }) => {
    
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (hasNavigation) {
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        }
    }, [onClose, onNext, onPrev, hasNavigation]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            style={{ animation: 'fadeIn 0.3s ease' }}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Vista de imagen ampliada"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-50"
                aria-label="Cerrar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {hasNavigation && (
                 <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition z-50"
                    aria-label="Imagen anterior"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                 </button>
            )}

            <div className="relative" onClick={(e) => e.stopPropagation()}>
                <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="max-w-[90vw] max-h-[85vh] rounded-lg shadow-2xl"
                />
                {image.alt && <p className="text-center text-white mt-2 text-sm bg-black/50 rounded-b-lg py-1 px-2 absolute bottom-0 w-full">{image.alt}</p>}
            </div>

            {hasNavigation && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition z-50"
                    aria-label="Siguiente imagen"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

        </div>
    );
};


const Portfolio: React.FC = () => {
    type ViewMode = 'masonry' | 'gallery';
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState<ViewMode>('masonry');
    const [activeFilter, setActiveFilter] = useState(searchParams.get('category') || 'Todos');
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl && PORTFOLIO_CATEGORIES.includes(categoryFromUrl)) {
            setActiveFilter(categoryFromUrl);
        } else {
            setActiveFilter('Todos');
        }
    }, [searchParams]);

    const handleFilterChange = (category: string) => {
        setActiveFilter(category);
        if (category === 'Todos') {
            setSearchParams({});
        } else {
            setSearchParams({ category });
        }
    };

    const filteredImages = useMemo(() => {
        if (activeFilter === 'Todos') {
            return PORTFOLIO_IMAGES;
        }
        return PORTFOLIO_IMAGES.filter(image => image.category === activeFilter);
    }, [activeFilter]);
    
    useEffect(() => {
        // When filter changes, close lightbox to avoid index out of bounds
        setSelectedImageIndex(null);
    }, [activeFilter]);

    const openLightbox = (index: number) => {
        setSelectedImageIndex(index);
    };

    const closeLightbox = () => {
        setSelectedImageIndex(null);
    };
    
    const goToNextImage = useCallback(() => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex + 1) % filteredImages.length);
        }
    }, [selectedImageIndex, filteredImages.length]);
    
    const goToPrevImage = useCallback(() => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex - 1 + filteredImages.length) % filteredImages.length);
        }
    }, [selectedImageIndex, filteredImages.length]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center mb-12 reveal-on-scroll">
                <h1 className="text-4xl md:text-5xl font-bold text-pitaya-dark">Nuestro Trabajo</h1>
                <p className="text-lg text-pitaya-dark/70 mt-2">Inspírate con algunos de nuestros diseños favoritos.</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4 reveal-on-scroll" style={{ transitionDelay: '100ms' }}>
                {/* Category Filters */}
                <div className="flex justify-center flex-wrap gap-2 md:gap-4">
                    {PORTFOLIO_CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => handleFilterChange(category)}
                            className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition duration-300 ${activeFilter === category ? 'bg-pitaya-pink text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                
                {/* View Mode Switcher */}
                <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-full">
                    <button onClick={() => setViewMode('masonry')} className={`p-2 rounded-full transition ${viewMode === 'masonry' ? 'bg-white shadow' : 'text-gray-500 hover:text-gray-800'}`} aria-label="Vista Mosaico">
                         <span className="sr-only">Vista Mosaico</span>
                        <MasonryIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => setViewMode('gallery')} className={`p-2 rounded-full transition ${viewMode === 'gallery' ? 'bg-white shadow' : 'text-gray-500 hover:text-gray-800'}`} aria-label="Vista de Galería">
                        <span className="sr-only">Vista de Galería</span>
                        <GridIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className={viewMode === 'masonry' ? 'masonry' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'}>
                {filteredImages.map((image, index) => (
                    <div 
                        key={image.id} 
                        className={`${viewMode === 'masonry' ? 'masonry-item' : 'aspect-square'} reveal-on-scroll`}
                        style={{ transitionDelay: `${(index % 12) * 40}ms` }}
                        onClick={() => openLightbox(index)}
                    >
                        <img 
                            src={image.src} 
                            alt={image.alt} 
                            className={`rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer w-full h-full ${viewMode === 'gallery' ? 'object-cover' : ''}`}
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {selectedImageIndex !== null && (
                <ImageLightbox 
                    image={filteredImages[selectedImageIndex]}
                    onClose={closeLightbox}
                    onNext={goToNextImage}
                    onPrev={goToPrevImage}
                    hasNavigation={filteredImages.length > 1}
                />
            )}
        </div>
    );
};

export default Portfolio;
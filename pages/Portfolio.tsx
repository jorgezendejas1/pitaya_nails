import React, { useState, useMemo } from 'react';
import { PORTFOLIO_IMAGES, PORTFOLIO_CATEGORIES } from '../constants';

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


const Portfolio: React.FC = () => {
    type ViewMode = 'masonry' | 'gallery';
    const [viewMode, setViewMode] = useState<ViewMode>('masonry');
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

            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
                {/* Category Filters */}
                <div className="flex justify-center flex-wrap gap-2 md:gap-4">
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
                
                {/* View Mode Switcher */}
                <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-full">
                    <button onClick={() => setViewMode('masonry')} className={`p-2 rounded-full transition ${viewMode === 'masonry' ? 'bg-white shadow' : 'text-gray-500 hover:text-gray-800'}`} aria-label="Masonry View">
                         <span className="sr-only">Masonry View</span>
                        <MasonryIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => setViewMode('gallery')} className={`p-2 rounded-full transition ${viewMode === 'gallery' ? 'bg-white shadow' : 'text-gray-500 hover:text-gray-800'}`} aria-label="Gallery View">
                        <span className="sr-only">Gallery View</span>
                        <GridIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className={viewMode === 'masonry' ? 'masonry' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'}>
                {filteredImages.map((image) => (
                    <div 
                        key={image.id} 
                        className={viewMode === 'masonry' ? 'masonry-item' : 'aspect-square'} 
                        onClick={() => setSelectedImage(image.src)}
                    >
                        <img 
                            src={image.src} 
                            alt={image.alt} 
                            className={`rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer w-full h-full ${viewMode === 'gallery' ? 'object-cover' : ''}`}
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
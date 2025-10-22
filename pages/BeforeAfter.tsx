import React from 'react';
import { BEFORE_AFTER_IMAGES } from '../constants';

const BeforeAfter: React.FC = () => {
    return (
        <div className="bg-pitaya-beige min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-pitaya-dark font-serif">Transformaciones</h1>
                    <p className="text-lg text-pitaya-dark/70 mt-2">El resultado de la técnica, la pasión y el detalle.</p>
                </div>

                <div className="space-y-12 max-w-4xl mx-auto">
                    {BEFORE_AFTER_IMAGES.map((item, index) => (
                        <div 
                            key={item.id} 
                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/80 fade-in-up"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-semibold text-pitaya-dark font-serif">{item.title}</h2>
                                <p className="text-pitaya-dark/70 mt-1 max-w-2xl mx-auto">{item.description}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-gray-500 mb-2 tracking-widest uppercase">Antes</h3>
                                    <img 
                                        src={item.beforeSrc} 
                                        alt={`Antes - ${item.title}`} 
                                        className="rounded-lg shadow-md w-full aspect-[4/5] object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-pitaya-pink mb-2 tracking-widest uppercase">Después</h3>
                                    <img 
                                        src={item.afterSrc} 
                                        alt={`Después - ${item.title}`} 
                                        className="rounded-lg shadow-md w-full aspect-[4/5] object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BeforeAfter;

import React from 'react';
import { Link } from 'react-router-dom';

interface CallToActionBannerProps {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
}

const CallToActionBanner: React.FC<CallToActionBannerProps> = ({ title, subtitle, buttonText, buttonLink }) => {
    return (
        <div className="bg-pitaya-pink text-white rounded-lg shadow-xl p-8 md:py-12 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">{title}</h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">{subtitle}</p>
            <Link
                to={buttonLink}
                className="inline-block bg-white text-pitaya-pink font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-md"
            >
                {buttonText}
            </Link>
        </div>
    );
};

export default CallToActionBanner;
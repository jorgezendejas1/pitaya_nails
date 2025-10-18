import React from 'react';
import type { Service, TeamMember, Testimonial, PortfolioImage } from './types';

export const WHATSAPP_LINK = "https://wa.me/5219841123411?text=Hola,+quiero+agendar+una+cita+en+Pitaya+Nails.";
export const INSTAGRAM_LINK = "https://www.instagram.com/nailstation_cun";
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID"; // Replace YOUR_FORM_ID with your actual Formspree form ID

export const SERVICES: Service[] = [
  { id: 'mani-classic', name: 'Manicura Clásica', description: 'Cuidado completo de uñas y cutículas con esmaltado tradicional.', duration: 45, price: 350, category: 'Manicura', imageUrl: 'https://picsum.photos/seed/manicure/400/300' },
  { id: 'pedi-spa', name: 'Pedicura Spa', description: 'Relajante pedicura con exfoliación, masaje y esmaltado perfecto.', duration: 60, price: 550, category: 'Pedicura', imageUrl: 'https://picsum.photos/seed/pedicure/400/300' },
  { id: 'acrilicas', name: 'Uñas Acrílicas Esculturales', description: 'Creación de uñas esculturales con acrílico, personalizadas a tu gusto.', duration: 120, price: 850, category: 'Uñas Esculturales', imageUrl: 'https://picsum.photos/seed/acrylic/400/300' },
  { id: 'gel', name: 'Esmaltado en Gel (Gelish)', description: 'Color duradero y brillante por hasta 3 semanas.', duration: 60, price: 450, category: 'Manicura', imageUrl: 'https://picsum.photos/seed/gelish/400/300' },
  { id: 'nail-art', name: 'Nail Art Avanzado', description: 'Diseños a mano alzada, pedrería y efectos especiales (precio por uña).', duration: 30, price: 100, category: 'Nail Art', imageUrl: 'https://picsum.photos/seed/nailart/400/300', isCustomizable: true, customizationPrompt: 'Número de uñas', pricePerUnit: true, durationPerUnit: true },
  { id: 'spa-manos', name: 'Spa de Manos', description: 'Tratamiento rejuvenecedor con exfoliación profunda y mascarilla hidratante.', duration: 40, price: 400, category: 'Spa', imageUrl: 'https://picsum.photos/seed/handspa/400/300' }
];

export const TEAM: TeamMember[] = [
  { id: 1, name: 'Lily', role: 'Dueña / Nail Artist Principal', specialty: 'Especialista en uñas esculturales y diseño 3D.', imageUrl: 'https://picsum.photos/seed/lily/400/400', unavailableDays: [0] }, // Unavailable on Sunday
  { id: 2, name: 'Sofía', role: 'Técnica en Uñas', specialty: 'Experta en manicura perfecta y esmaltado en gel.', imageUrl: 'https://picsum.photos/seed/sofia/400/400', unavailableDays: [0, 3] }, // Unavailable on Sunday, Wednesday
  { id: 3, name: 'Valeria', role: 'Técnica en Uñas y Pedicurista', specialty: 'Maestra de la pedicura spa y diseños creativos.', imageUrl: 'https://picsum.photos/seed/valeria/400/400', unavailableDays: [0, 1] } // Unavailable on Sunday, Monday
];

export const TESTIMONIALS: Testimonial[] = [
  { quote: '¡El mejor lugar en Cancún! Lily es una verdadera artista y mis uñas nunca se habían visto tan espectaculares. El ambiente es súper relajante.', author: 'Ana G.' },
  { quote: 'Calidad y atención al detalle impecables. Siempre salgo feliz y con unas uñas perfectas que duran semanas. ¡100% recomendado!', author: 'Mariana P.' },
  { quote: 'Me encanta la creatividad del equipo. Siempre tienen nuevas ideas y logran plasmar exactamente lo que quiero. ¡Son las mejores!', author: 'Fernanda L.' }
];

export const PORTFOLIO_CATEGORIES = ['Todos', 'Manicura', 'Pedicura', 'Uñas Esculturales', 'Nail Art'];

export const PORTFOLIO_IMAGES: PortfolioImage[] = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  src: `https://picsum.photos/seed/nail-design-${i}/600/800`,
  alt: `Diseño de uñas ${i + 1}`,
  category: PORTFOLIO_CATEGORIES[(i % 4) + 1],
}));

export const DIPLOMAS_IMAGES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  src: `https://picsum.photos/seed/diploma-${i}/600/400`,
  alt: `Certificación ${i + 1}`
}));

export const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
    </svg>
);

export const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2.04C6.5 2.04 2.04 6.5 2.04 12c0 1.8.46 3.48 1.32 5L2 22l5.25-1.38c1.45.83 3.08 1.32 4.75 1.32 5.48 0 9.92-4.44 9.92-9.92C21.92 6.5 17.48 2.04 12 2.04zm4.88 11.52c-.24-.12-1.4-.7-1.62-.78s-.38-.12-.54.12c-.16.24-.6.78-.75.94s-.3.18-.54.06c-.24-.12-1.02-.38-1.94-1.2s-1.42-1.82-1.66-2.12c-.24-.3-.02-.46.1-.6.12-.12.26-.32.4-.42.12-.12.18-.2.24-.34.06-.12.02-.24-.04-.34s-.54-1.3-.74-1.8c-.18-.48-.38-.4-.52-.4h-.5c-.16 0-.42.06-.64.3s-.86.84-.86 2.04c0 1.2.88 2.36 1 2.52.12.16 1.74 2.8 4.22 3.72.6.22 1.06.36 1.42.46.56.16 1.08.14 1.48-.08.42-.22 1.24-.98 1.4-1.36.18-.38.18-.7.12-.82s-.18-.18-.42-.3z"/>
    </svg>
);

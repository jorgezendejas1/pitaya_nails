
import React from 'react';
import type { Service, TeamMember, Testimonial, PortfolioImage } from './types';

export const WHATSAPP_LINK = "https://wa.me/529841123411";
export const INSTAGRAM_LINK = "https://www.instagram.com/nailstation_cun";
export const BOOKING_LINK = "https://calendar.app.google/uzzcfsLW9x4WcCAi6";

export const SERVICES: Service[] = [
  { id: 'mani-classic', name: 'Manicura Clásica', description: 'Cuidado completo de uñas y cutículas con esmaltado tradicional.', duration: 45, price: 350, category: 'Manicura', imageUrl: 'https://picsum.photos/seed/manicure/400/300' },
  { id: 'pedi-spa', name: 'Pedicura Spa', description: 'Relajante pedicura con exfoliación, masaje y esmaltado perfecto.', duration: 60, price: 550, category: 'Pedicura', imageUrl: 'https://picsum.photos/seed/pedicure/400/300' },
  { id: 'acrilicas', name: 'Uñas Acrílicas Esculturales', description: 'Creación de uñas esculturales con acrílico, personalizadas a tu gusto.', duration: 120, price: 850, category: 'Uñas Esculturales', imageUrl: 'https://picsum.photos/seed/acrylic/400/300' },
  { id: 'gel', name: 'Esmaltado en Gel (Gelish)', description: 'Color duradero y brillante por hasta 3 semanas.', duration: 60, price: 450, category: 'Manicura', imageUrl: 'https://picsum.photos/seed/gelish/400/300' },
  { id: 'nail-art', name: 'Nail Art Avanzado', description: 'Diseños a mano alzada, pedrería y efectos especiales (precio por uña).', duration: 30, price: 100, category: 'Nail Art', imageUrl: 'https://picsum.photos/seed/nailart/400/300' },
  { id: 'spa-manos', name: 'Spa de Manos', description: 'Tratamiento rejuvenecedor con exfoliación profunda y mascarilla hidratante.', duration: 40, price: 400, category: 'Spa', imageUrl: 'https://picsum.photos/seed/handspa/400/300' }
];

export const TEAM: TeamMember[] = [
  { id: 1, name: 'Lily', role: 'Dueña / Nail Artist Principal', specialty: 'Especialista en uñas esculturales y diseño 3D.', imageUrl: 'https://picsum.photos/seed/lily/400/400' },
  { id: 2, name: 'Sofía', role: 'Técnica en Uñas', specialty: 'Experta en manicura perfecta y esmaltado en gel.', imageUrl: 'https://picsum.photos/seed/sofia/400/400' },
  { id: 3, name: 'Valeria', role: 'Técnica en Uñas y Pedicurista', specialty: 'Maestra de la pedicura spa y diseños creativos.', imageUrl: 'https://picsum.photos/seed/valeria/400/400' }
];

export const TESTIMONIALS: Testimonial[] = [
  { quote: '¡El mejor lugar en Cancún! Lily es una verdadera artista y mis uñas nunca se habían visto tan espectaculares. El ambiente es súper relajante.', author: 'Ana G.' },
  { quote: 'Calidad y atención al detalle impecables. Siempre salgo feliz y con unas uñas perfectas que duran semanas. ¡100% recomendado!', author: 'Mariana P.' },
  { quote: 'Me encanta la creatividad del equipo. Siempre tienen nuevas ideas y logran plasmar exactamente lo que quiero. ¡Son las mejores!', author: 'Fernanda L.' }
];

export const PORTFOLIO_CATEGORIES = ['Todos', 'Manicura', 'Pedicura', 'Uñas Esculturales', 'Nail Art'];

export const PORTFOLIO_IMAGES: PortfolioImage[] = Array.from({ length: 40 }, (_, i) => ({
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
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

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
  { id: 'nail-art', name: 'Nail Art Avanzado', description: 'Diseños a mano alzada, pedrería y efectos especiales (precio por uña).', duration: 30, price: 100, category: 'Nail Art', imageUrl: 'https://picsum.photos/seed/nailart/400/300' },
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
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.02c5.45 0 9.89-4.45 9.89-9.91C21.96 6.45 17.5 2 12.04 2zM12.02 20.12c-1.48 0-2.93-.39-4.2-1.12l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.32-1.26-2.83-1.26-4.39 0-4.54 3.69-8.23 8.24-8.23 4.54 0 8.23 3.69 8.23 8.23 0 4.54-3.69 8.23-8.23 8.23zm4.5-5.45c-.25-.12-1.47-.72-1.7-.82s-.39-.12-.56.12c-.17.25-.64.82-.79.98s-.29.17-.54.06c-.25-.12-1.06-.39-2.02-1.25s-1.45-1.92-1.61-2.24c-.16-.32-.02-.5.1-.64s.25-.29.37-.44c.12-.14.17-.25.25-.41s.12-.3-.06-.54c-.18-.25-1.47-3.53-1.7-4.04s-.47-.42-.64-.42c-.17 0-.37-.02-.56-.02s-.5.25-.76.5c-.26.25-1.01 1-1.01 2.44s1.04 2.83 1.18 3.03c.14.2 2.01 3.2 4.93 4.33.58.26 1.16.41 1.76.41.81 0 1.47-.35 1.68-1.18.21-.58.21-1.08.15-1.18s-.25-.18-.5-.3z"/>
    </svg>
);
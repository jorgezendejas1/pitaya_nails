import React from 'react';
import type { Service, TeamMember, Testimonial, PortfolioImage } from './types';

export const WHATSAPP_LINK = "https://wa.me/529841123411?text=Hola,+quiero+agendar+una+cita+en+Pitaya+Nails.";
export const INSTAGRAM_LINK = "https://www.instagram.com/nailstation_cun";
export const SALON_EMAIL_ADDRESS = "info@pitayanails.com"; // Email for receiving booking notifications
// FIX: Add missing FORMSPREE_ENDPOINT export for the contact form.
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/mqkrvylp";

export const SERVICES: Service[] = [
  { id: 'mani-classic', name: 'Manicura Clásica', description: 'Cuidado completo de uñas y cutículas con esmaltado tradicional.', duration: 45, price: 350, category: 'Manicura', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/mani-classic.png' },
  { id: 'pedi-spa', name: 'Pedicura Spa', description: 'Relajante pedicura con exfoliación, masaje y esmaltado perfecto.', duration: 60, price: 550, category: 'Pedicura', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/pedi-spa.png' },
  { id: 'acrilicas', name: 'Uñas Acrílicas Esculturales', description: 'Creación de uñas esculturales con acrílico, personalizadas a tu gusto.', duration: 120, price: 850, category: 'Uñas Esculturales', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/acrilicas.png' },
  { id: 'gel', name: 'Esmaltado en Gel (Gelish)', description: 'Color duradero y brillante por hasta 3 semanas.', duration: 60, price: 450, category: 'Manicura', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/gel.png' },
  { id: 'nail-art', name: 'Nail Art Avanzado', description: 'Diseños a mano alzada, pedrería y efectos especiales (precio por uña).', duration: 15, price: 100, category: 'Nail Art', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/nail-art.png', isCustomizable: true, customizationPrompt: 'Número de uñas', pricePerUnit: true, durationPerUnit: true },
  { id: 'spa-manos', name: 'Spa de Manos', description: 'Tratamiento rejuvenecedor con exfoliación profunda y mascarilla hidratante.', duration: 40, price: 400, category: 'Spa', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/spa-manos.png' },
  { id: 'mani-rusa', name: 'Manicura Rusa en Seco', description: 'Técnica precisa de limpieza profunda de cutícula con torno para un acabado impecable y duradero.', duration: 75, price: 500, category: 'Manicura', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/mani-rusa.png' },
  { id: 'retiro-gel', name: 'Retiro de Esmalte en Gel', description: 'Eliminación segura y profesional de esmalte en gel, protegiendo la uña natural.', duration: 30, price: 150, category: 'Manicura', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/retiro-gel.png' },
  { id: 'reparacion', name: 'Reparación de Uña', description: 'Arreglo de uña rota o agrietada con acrílico o gel constructor (precio por uña).', duration: 15, price: 80, category: 'Uñas Esculturales', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/reparacion.png', pricePerUnit: true, durationPerUnit: true, isCustomizable: true, customizationPrompt: 'Número de uñas' },
  { id: 'pedi-classic', name: 'Pedicura Clásica', description: 'Cuidado esencial para tus pies, incluye limado, cutículas, exfoliación suave y esmaltado tradicional.', duration: 50, price: 400, category: 'Pedicura', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/pedi-classic.png' },
  { id: 'relleno-acrilico', name: 'Relleno de Acrílico', description: 'Mantenimiento para uñas acrílicas (hasta 3 semanas), rellenando el crecimiento.', duration: 90, price: 650, category: 'Uñas Esculturales', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/relleno-acrilico.png' },
  { id: 'polygel', name: 'Uñas de Polygel', description: 'Ligeras, flexibles y resistentes. La innovación entre el acrílico y el gel.', duration: 120, price: 900, category: 'Uñas Esculturales', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/polygel.png' },
  { id: 'soft-gel', name: 'Extensión con Soft Gel', description: 'Extensiones de uña completas pre-moldeadas con gel. Ligeras y de aspecto natural.', duration: 90, price: 750, category: 'Uñas Esculturales', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/soft-gel.png' },
  { id: 'nail-art-french', name: 'Diseño Francés', description: 'El clásico y elegante diseño francés en punta, personalizable en colores.', duration: 20, price: 150, category: 'Nail Art', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/nail-art-french.png' },
  { id: 'nail-art-chrome', name: 'Efecto Espejo / Cromo', description: 'Acabado metálico y reflectante que captura todas las miradas (precio por set completo).', duration: 25, price: 200, category: 'Nail Art', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/nail-art-chrome.png' },
  { id: 'parafina', name: 'Tratamiento de Parafina', description: 'Baño de parafina caliente para una hidratación profunda de manos o pies.', duration: 20, price: 250, category: 'Spa', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/parafina.png' },
  { id: 'spa-pies', name: 'Spa de Pies', description: 'Un tratamiento de lujo para tus pies con sales minerales, exfoliación profunda y mascarilla.', duration: 45, price: 480, category: 'Spa', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/spa-pies.png' }
];

export const TEAM: TeamMember[] = [
  { id: 1, name: 'Lily', role: 'Dueña / Nail Artist Principal', specialty: 'Especialista en uñas esculturales y diseño 3D.', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/team-lily.png', unavailableDays: [0] }, // Unavailable on Sunday
  { id: 2, name: 'Sofía', role: 'Técnica en Uñas', specialty: 'Experta en manicura perfecta y esmaltado en gel.', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/team-sofia.png', unavailableDays: [0, 3] }, // Unavailable on Sunday, Wednesday
  { id: 3, name: 'Valeria', role: 'Técnica en Uñas y Pedicurista', specialty: 'Maestra de la pedicura spa y diseños creativos.', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/generated/team-valeria.png', unavailableDays: [0, 1] } // Unavailable on Sunday, Monday
];

export const TESTIMONIALS: Testimonial[] = [
  { quote: '¡El mejor lugar en Cancún! Lily es una verdadera artista y mis uñas nunca se habían visto tan espectaculares. El ambiente es súper relajante.', author: 'Ana G.' },
  { quote: 'Calidad y atención al detalle impecables. Siempre salgo feliz y con unas uñas perfectas que duran semanas. ¡100% recomendado!', author: 'Mariana P.' },
  { quote: 'Me encanta la creatividad del equipo. Siempre tienen nuevas ideas y logran plasmar exactamente lo que quiero. ¡Son las mejores!', author: 'Fernanda L.' }
];

export const PORTFOLIO_CATEGORIES = ['Todos', 'Manicura', 'Pedicura', 'Uñas Esculturales', 'Nail Art'];

export const PORTFOLIO_IMAGES: PortfolioImage[] = [
    { id: 0, src: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/nail-design-1.png', alt: 'Diseño de uñas francés con detalles dorados', category: 'Manicura' },
    { id: 1, src: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/nail-design-2.png', alt: 'Diseño de uñas ombré lila y blanco con pedrería', category: 'Uñas Esculturales' },
    { id: 2, src: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/nail-design-3.png', alt: 'Diseño de uñas rosa pálido largas y elegantes', category: 'Manicura' },
    { id: 3, src: 'https://storage.googleapis.com/aistudio-hosting/gallery-assets/pitaya-nails/nail-design-4.png', alt: 'Diseño de uñas holográfico con líneas de colores', category: 'Nail Art' },
    ...Array.from({ length: 96 }, (_, i) => ({
        id: i + 4,
        src: `https://picsum.photos/seed/nail-design-${i}/600/800`,
        alt: `Diseño de uñas ${i + 5}`,
        category: PORTFOLIO_CATEGORIES[((i+4) % 4) + 1],
    }))
];


export const DIPLOMAS_IMAGES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  src: `https://picsum.photos/seed/diploma-${i}/600/400`,
  alt: `Certificación ${i + 1}`
}));

export const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    // FIX: Corrected typo in viewBox attribute (extra `24"`). This caused a cascade of parsing errors.
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

export const LocationMarkerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

export const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
    </svg>
);

export const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

export const ClipboardListIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const PriceTagIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const MagnifyingGlassIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

export const SlidersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
);

export const IdCardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0z" />
    </svg>
);

export const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
    </svg>
);
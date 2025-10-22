export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number; // in MXN
  category: string;
  imageUrl: string;
  isCustomizable?: boolean;
  customizationPrompt?: string;
  pricePerUnit?: boolean;
  durationPerUnit?: boolean;
}

export interface TeamMember {
  id: number;
  name:string;
  role: string;
  specialty: string;
  imageUrl: string;
  unavailableDays: number[]; // 0 for Sunday, 1 for Monday, etc.
}

export interface Testimonial {
  quote: string;
  author: string;
}

export interface PortfolioImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

export interface BookingHistoryItem {
  id: number;
  date: string; // ISO string of the original appointment
  services: { id: string; name: string }[];
  professionalName: string;
  totalPrice: number;
  totalDuration: number;
}

export interface BeforeAfterImage {
  id: number;
  title: string;
  description: string;
  beforeSrc: string;
  afterSrc: string;
}


export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number; // in MXN
  category: string;
  imageUrl: string;
}

export interface TeamMember {
  id: number;
  name:string;
  role: string;
  specialty: string;
  imageUrl: string;
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

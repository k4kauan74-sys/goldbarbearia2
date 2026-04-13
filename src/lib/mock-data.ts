
import { Service, Professional } from './types';

export const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Corte', price: 50.00, duration: 30, description: 'Corte de cabelo masculino com acabamento premium.' },
  { id: 's2', name: 'Barba', price: 35.00, duration: 20, description: 'Barba feita com toalha quente e navalha.' },
  { id: 's3', name: 'Corte + Barba', price: 75.00, duration: 50, description: 'Combo completo de cabelo e barba.' },
  { id: 's4', name: 'Sobrancelha', price: 15.00, duration: 10, description: 'Limpeza e design de sobrancelha.' },
  { id: 's5', name: 'Acabamento', price: 20.00, duration: 15, description: 'Apenas limpeza de nuca e costeletas.' },
];

export const MOCK_PROFESSIONALS: Professional[] = [
  { 
    id: 'p1', 
    name: 'Ricardo "Mãos de Tesoura"', 
    photo: 'https://picsum.photos/seed/barber-p1/400/500', 
    specialty: 'Cortes Clássicos & Degradê',
    commission: 50,
    active: true 
  },
  { 
    id: 'p2', 
    name: 'Lucas Barba de Ouro', 
    photo: 'https://picsum.photos/seed/barber-p2/400/500', 
    specialty: 'Visagismo de Barba',
    commission: 40,
    active: true 
  },
  { 
    id: 'p3', 
    name: 'André Estilo', 
    photo: 'https://picsum.photos/seed/barber-p3/400/500', 
    specialty: 'Cabelos Modernos',
    commission: 45,
    active: true 
  },
];

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
];

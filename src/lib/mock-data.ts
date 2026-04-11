
import { Service, Professional } from './types';

export const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Corte', price: 50.00, duration: 30 },
  { id: 's2', name: 'Barba', price: 35.00, duration: 20 },
  { id: 's3', name: 'Corte + Barba', price: 75.00, duration: 50 },
  { id: 's4', name: 'Sobrancelha', price: 15.00, duration: 10 },
  { id: 's5', name: 'Acabamento', price: 20.00, duration: 15 },
];

export const MOCK_PROFESSIONALS: Professional[] = [
  { 
    id: 'p1', 
    name: 'Ricardo "Mãos de Tesoura"', 
    photo: 'https://picsum.photos/seed/barber-p1/400/500', 
    specialty: 'Cortes Clássicos & Degradê',
    active: true 
  },
  { 
    id: 'p2', 
    name: 'Lucas Barba de Ouro', 
    photo: 'https://picsum.photos/seed/barber-p2/400/500', 
    specialty: 'Visagismo de Barba',
    active: true 
  },
  { 
    id: 'p3', 
    name: 'André Estilo', 
    photo: 'https://picsum.photos/seed/barber-p3/400/500', 
    specialty: 'Cabelos Modernos',
    active: true 
  },
];

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
];

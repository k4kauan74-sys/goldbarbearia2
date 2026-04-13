
import { Service, Professional } from './types';

export const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

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
    active: true,
    workingHours: TIME_SLOTS.slice(18, 38) // Exemplo: 09:00 às 19:00
  },
  { 
    id: 'p2', 
    name: 'Lucas Barba de Ouro', 
    photo: 'https://picsum.photos/seed/barber-p2/400/500', 
    specialty: 'Visagismo de Barba',
    commission: 40,
    active: true,
    workingHours: TIME_SLOTS.slice(20, 30)
  },
  { 
    id: 'p3', 
    name: 'André Estilo', 
    photo: 'https://picsum.photos/seed/barber-p3/400/500', 
    specialty: 'Cabelos Modernos',
    commission: 45,
    active: true,
    workingHours: TIME_SLOTS.slice(24, 40)
  },
];

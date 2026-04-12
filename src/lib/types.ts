
export type Service = {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
};

export type Professional = {
  id: string;
  name: string;
  photo: string;
  specialty: string;
  commission: number; // Percentage (0-100)
  active: boolean;
};

export type Appointment = {
  id: string;
  clientName: string;
  phone: string;
  serviceId: string;
  professionalId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'confirmed' | 'cancelled' | 'pending';
};

export type Availability = {
  id: string;
  professionalId: string;
  date: string;
  time: string;
  available: boolean;
};

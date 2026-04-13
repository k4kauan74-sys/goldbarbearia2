
export type Service = {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description?: string;
};

export type Professional = {
  id: string;
  name: string;
  email?: string;
  password?: string;
  photo: string;
  specialty: string;
  commission: number; // Percentage (0-100)
  active: boolean;
  workingHours?: string[]; // Array of time slots like ["09:00", "09:30"]
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

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'barber';
};

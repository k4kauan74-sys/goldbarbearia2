
import { BookingForm } from "@/components/booking-form";
import { Navbar } from "@/components/navbar";

export default function AgendarPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            Reserva <span className="text-primary">Online</span>
          </h1>
          <p className="text-white/40 text-lg font-medium">Siga os passos abaixo para garantir seu horário.</p>
        </div>
        
        <BookingForm />
      </main>
    </div>
  );
}

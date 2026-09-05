
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AgendarPage() {
  const router = useRouter();
  useEffect(() => {
    window.location.href = "https://navalhago.app/gold-barbearia";
  }, []);
  return null;
}

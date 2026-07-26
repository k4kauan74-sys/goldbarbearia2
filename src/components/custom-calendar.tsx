
"use client";

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomCalendarProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date) => void;
  disabledDays?: (date: Date) => boolean;
}

export function CustomCalendar({ selectedDate, onSelect, disabledDays }: CustomCalendarProps) {
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  
  const weekdays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const calendarData = useMemo(() => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        month: month - 1,
        year: year,
        isCurrentMonth: false
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true
      });
    }

    const totalSlots = 42;
    const nextMonthPadding = totalSlots - days.length;
    for (let i = 1; i <= nextMonthPadding; i++) {
      days.push({
        day: i,
        month: month + 1,
        year: year,
        isCurrentMonth: false
      });
    }

    return days;
  }, [currentViewDate]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + offset, 1);
    setCurrentViewDate(newDate);
  };

  const isSelected = (day: number, month: number, year: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const handleDayClick = (dayData: any) => {
    const date = new Date(dayData.year, dayData.month, dayData.day);
    if (disabledDays && disabledDays(date)) return;
    onSelect(date);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="font-anton text-xl uppercase tracking-widest text-white">
          {months[currentViewDate.getMonth()]} <span className="text-[#D4AF37]">{currentViewDate.getFullYear()}</span>
        </h3>
        <div className="flex gap-1">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-2 hover:text-[#D4AF37] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => changeMonth(1)}
            className="p-2 hover:text-[#D4AF37] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-4 opacity-20">
        {weekdays.map((wd) => (
          <div key={wd} className="text-center text-[8px] font-bold tracking-widest">
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarData.map((d, idx) => {
          const date = new Date(d.year, d.month, d.day);
          const isDisabled = disabledDays ? disabledDays(date) : false;
          const selected = d.isCurrentMonth && isSelected(d.day, d.month, d.year);
          const current = d.isCurrentMonth && isToday(d.day, d.month, d.year);

          return (
            <button
              key={idx}
              disabled={isDisabled || !d.isCurrentMonth}
              onClick={() => handleDayClick(d)}
              className={cn(
                "relative aspect-square flex items-center justify-center rounded-xl text-[10px] font-anton transition-all duration-300",
                !d.isCurrentMonth && "opacity-0 pointer-events-none",
                d.isCurrentMonth && !selected && !isDisabled && "hover:bg-white/5",
                selected && "bg-[#D4AF37] text-black font-bold",
                current && !selected && "text-[#D4AF37] border border-[#D4AF37]/20",
                isDisabled && d.isCurrentMonth && "opacity-10 cursor-not-allowed"
              )}
            >
              {d.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

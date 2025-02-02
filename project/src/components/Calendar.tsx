import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CourseEvent } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CalendarProps {
  events: CourseEvent[];
}

export function Calendar({ events }: CalendarProps) {
  const { theme } = useTheme();

  return (
    <div className="h-[600px] bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-colors">
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: '',
          center: 'title',
          right: ''
        }}
        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
        weekends={false}
        events={events}
        height="100%"
        slotDuration="00:30:00"
        expandRows={true}
        eventContent={(eventInfo) => {
          return (
            <div className="p-1 text-xs">
              <div className="font-semibold">{eventInfo.event.title}</div>
              <div>{eventInfo.event.extendedProps.description}</div>
            </div>
          );
        }}
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }}
        themeSystem={theme === 'dark' ? 'darkly' : 'standard'}
      />
    </div>
  );
}
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Upload as UploadIcon } from 'lucide-react';
import { Course, CourseEvent } from './types';
import { CourseForm } from './components/CourseForm';
import { FileUpload } from './components/FileUpload';
import { Calendar } from './components/Calendar';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './context/ThemeContext';
import toast from 'react-hot-toast';

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'upload'>('form');
  const { theme } = useTheme();

  const handleCourseSubmit = (course: Course) => {
    // Check for schedule conflicts
    const hasConflict = checkScheduleConflicts(course);
    if (hasConflict) {
      toast.error('Schedule conflict detected! Please choose different time slots.');
      return;
    }

    const newCourse = { ...course, id: crypto.randomUUID() };
    setCourses((prev) => [...prev, newCourse]);
    toast.success('Course added successfully!');
  };

  const handleFileUpload = (data: Course[]) => {
    // Validate and process the uploaded data
    const validCourses = data.filter(course => {
      const isValid = course.name && course.credits && course.schedule?.length > 0;
      if (!isValid) {
        toast.error(`Invalid course data: ${course.name || 'Unnamed course'}`);
      }
      return isValid;
    }).map(course => ({ ...course, id: crypto.randomUUID() }));

    setCourses(validCourses);
  };

  const checkScheduleConflicts = (newCourse: Course): boolean => {
    for (const course of courses) {
      for (const newSlot of newCourse.schedule) {
        for (const existingSlot of course.schedule) {
          if (newSlot.day === existingSlot.day) {
            const newStart = new Date(`1970-01-01T${newSlot.startTime}`);
            const newEnd = new Date(`1970-01-01T${newSlot.endTime}`);
            const existingStart = new Date(`1970-01-01T${existingSlot.startTime}`);
            const existingEnd = new Date(`1970-01-01T${existingSlot.endTime}`);

            if (
              (newStart >= existingStart && newStart < existingEnd) ||
              (newEnd > existingStart && newEnd <= existingEnd) ||
              (newStart <= existingStart && newEnd >= existingEnd)
            ) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const generateCalendarEvents = (): CourseEvent[] => {
    const events: CourseEvent[] = [];
    const colors = theme === 'light' ? [
      { bg: '#bfdbfe', border: '#3b82f6', text: '#1e40af' }, // blue
      { bg: '#bbf7d0', border: '#22c55e', text: '#166534' }, // green
      { bg: '#fecaca', border: '#ef4444', text: '#991b1b' }, // red
      { bg: '#ddd6fe', border: '#8b5cf6', text: '#5b21b6' }, // purple
      { bg: '#fed7aa', border: '#f97316', text: '#9a3412' }, // orange
      { bg: '#fde68a', border: '#f59e0b', text: '#92400e' }, // amber
      { bg: '#fbcfe8', border: '#ec4899', text: '#9d174d' }, // pink
      { bg: '#99f6e4', border: '#14b8a6', text: '#115e59' }, // teal
    ] : [
      { bg: '#1e3a8a', border: '#3b82f6', text: '#bfdbfe' }, // blue
      { bg: '#14532d', border: '#22c55e', text: '#bbf7d0' }, // green
      { bg: '#7f1d1d', border: '#ef4444', text: '#fecaca' }, // red
      { bg: '#4c1d95', border: '#8b5cf6', text: '#ddd6fe' }, // purple
      { bg: '#7c2d12', border: '#f97316', text: '#fed7aa' }, // orange
      { bg: '#78350f', border: '#f59e0b', text: '#fde68a' }, // amber
      { bg: '#831843', border: '#ec4899', text: '#fbcfe8' }, // pink
      { bg: '#134e4a', border: '#14b8a6', text: '#99f6e4' }, // teal
    ];

    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    monday.setHours(0, 0, 0, 0);

    courses.forEach((course, courseIndex) => {
      const colorIndex = courseIndex % colors.length;
      
      course.schedule.forEach((slot) => {
        const dayOffset = {
          monday: 0,
          tuesday: 1,
          wednesday: 2,
          thursday: 3,
          friday: 4,
        }[slot.day];

        const slotDate = new Date(monday);
        slotDate.setDate(monday.getDate() + dayOffset);

        const [startHour, startMinute] = slot.startTime.split(':').map(Number);
        const [endHour, endMinute] = slot.endTime.split(':').map(Number);

        const start = new Date(slotDate);
        start.setHours(startHour, startMinute, 0);

        const end = new Date(slotDate);
        end.setHours(endHour, endMinute, 0);

        events.push({
          id: `${course.id}-${slot.day}`,
          title: `${course.name} (${course.credits} cr)`,
          description: `${slot.startTime} - ${slot.endTime}`,
          start: start.toISOString(),
          end: end.toISOString(),
          backgroundColor: colors[colorIndex].bg,
          borderColor: colors[colorIndex].border,
          textColor: colors[colorIndex].text,
          extendedProps: {
            credits: course.credits
          }
        });
      });
    });

    return events;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Schedule Planner</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Plan your academic schedule by adding courses and viewing them in a weekly calendar.
              </p>
            </div>
            <ThemeToggle />
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('form')}
                className={`${
                  activeTab === 'form'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                } flex items-center whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Add Course
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`${
                  activeTab === 'upload'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                } flex items-center whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                <UploadIcon className="h-5 w-5 mr-2" />
                Upload Schedule
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {activeTab === 'form' ? (
                <CourseForm onSubmit={handleCourseSubmit} />
              ) : (
                <FileUpload onUpload={handleFileUpload} />
              )}
            </div>
            <div>
              <Calendar events={generateCalendarEvents()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
export interface Course {
  id?: string;
  name: string;
  credits: string | number;
  schedule: Schedule[];
}

export interface Schedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  startTime: string;
  endTime: string;
}

export interface CourseEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    credits: string | number;
    description?: string;
  };
}
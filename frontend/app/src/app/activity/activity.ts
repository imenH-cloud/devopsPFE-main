export enum ActivityType {
  ACADEMIC = 'academic',
  SPORTS = 'sports',
  CULTURAL = 'cultural',
  CLUB = 'club',
  OTHER = 'other'
}

export interface Activity {
  id: number;
  name: string;
  type: ActivityType;
  description: string;
  location?: string;
  date: Date;
  duration: number; // in minutes
  isCompleted: boolean;
  classroom: {
    id: number;
    name: string;
  };
  metadata?: {
    resources?: string[];
    attachments?: string[];
    comments?: string;
  };
}

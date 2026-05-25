export interface Classroom {
  id: number;
  name: string;
  capacity: number;
  isActive?: boolean;
}

export interface CreateClassroomDto {
  name: string;
  capacity: number;
  isActive?: boolean;
}

export interface UpdateClassroomDto {
  name?: string;
  capacity?: number;
  isActive?: boolean;
}

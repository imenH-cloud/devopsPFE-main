// user.interface.ts
export interface User {
  id: number;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  picture: string | null;
  address: string | null;
  zipCode: string | null;
  password: string | null;
  saltRounds: string;
  token: string;
  active: boolean;
  createdAt: Date | null;
  createdBy: number | null;
  updatedAt: Date | null;
  updatedBy: number | null;
  deletedAt: Date | null;
}

// create-user.dto.ts
export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  picture?: string;
  address?: string;
  zipCode?: string;
  password: string;
}

// update-user.dto.ts
export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  picture?: string;
  address?: string;
  zipCode?: string;
  active?: boolean;
}
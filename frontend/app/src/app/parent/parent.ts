// parent.interface.ts
export interface Parent {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  NCIN: number;
  address: string;
  typeInsurance: string;
  Numeroinsurance: string;
  job: string;
  students?: Student[];
}

// create-parent.dto.ts
export interface CreateParentDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  NCIN: number;
  address: string;
  typeInsurance: string;
  Numeroinsurance: string;
  job: string;
}

// update-parent.dto.ts
export interface UpdateParentDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  NCIN?: number;
  address?: string;
  typeInsurance?: string;
  Numeroinsurance?: string;
  job?: string;
}

// student.interface.ts (referenced in parent)
export interface Student {
  id: number;
  name: string;
  parentId: number;
  // Add other student properties as needed
}

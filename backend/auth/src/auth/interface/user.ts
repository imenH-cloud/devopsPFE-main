export interface User{


  id: number;

  
  email: string | null;

  
  firstName: string | null;

  
  lastName: string | null;

  
  phone: string | null;

  

  
  address: string | null;

  zipCode: string | null;

  
  password: string | null;

  
  saltRounds: string;

  
  token: string;

  active: boolean | false;

  
  createdAt: Date | null;

 
  createdBy: number | null;


  updatedBy: number | null;

  
  deletedAt: Date | null;
}
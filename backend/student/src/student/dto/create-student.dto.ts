import { IsString, IsNumber, IsNotEmpty, IsOptional, IsBoolean, IsDate, IsEmail } from 'class-validator';

export class CreateStudentDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    numeroInscriptio: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsDate()
    dateOfBirth: Date;

    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    observations?: string;

    @IsOptional()
    @IsString()
    reports?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsNotEmpty()
    @IsDate()
    enrollmentDate: Date;

    @IsOptional()
    @IsNumber()
    parentId?: number;

    @IsOptional()
    @IsNumber()
    classroomId?: number;
}

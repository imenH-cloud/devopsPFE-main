import { IsString, IsNumber, IsNotEmpty, IsOptional, IsBoolean, IsDate } from 'class-validator';

export class CreateActivityDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsNotEmpty()
    @IsDate()
    date: Date;

    @IsNotEmpty()
    @IsNumber()
    duration: number;

    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean;

    @IsOptional()
    @IsString()
    metadata?: string;

    @IsNotEmpty()
    @IsNumber()
    classroomId: number;
}

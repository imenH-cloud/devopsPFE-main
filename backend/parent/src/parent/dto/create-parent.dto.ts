import { IsString, IsEmail, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateParentDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    NCIN: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    typeInsurance: string;

    @IsNotEmpty()
    @IsString()
    Numeroinsurance: string;

    @IsNotEmpty()
    @IsString()
    job: string;
}

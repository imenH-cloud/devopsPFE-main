/* eslint-disable */

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class AuthUserDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  readonly rememberMe?: boolean
}

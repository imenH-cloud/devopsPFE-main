 import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import {
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty()
  @Column('text', { name: 'email', nullable: true, unique: true })
  email: string | null;

  @ApiProperty()
  @Column('text', { name: 'firstName', nullable: true })
  firstName: string | null;

  @ApiProperty()
  @Column('text', { name: 'lastName', nullable: true })
  lastName: string | null;

  @ApiProperty()
  @Column('text', { name: 'phone', nullable: true })
  phone: string | null;

  @ApiProperty()
  @Column('text', { name: 'picture', nullable: true })
  picture: string | null;

  @ApiProperty()
  @Column('text', { name: 'address', nullable: true })
  address: string | null;

  @ApiProperty()
  @Column('text', { name: 'zipcode', nullable: true })
  zipCode: string | null;

  @ApiProperty()
  @Column('text', { name: 'password', nullable: true })
  password: string | null;

  @ApiProperty()
  @Column('text', { name: 'saltRounds', nullable: true })
  saltRounds: string;

  @ApiProperty()
  @Column('text', { name: 'token', nullable: true })
  token: string;

  @ApiProperty()
  @Column('boolean', { name: 'active', nullable: true, default: true })
  active: boolean | false;

  @ApiProperty()
  @Column('timestamp with time zone', { name: 'createdAt', nullable: true })
  createdAt: Date | null;

  @ApiProperty()
  @Column('integer', { name: 'createdBy', nullable: true })
  createdBy: number | null;

  @ApiProperty()
  @Column('timestamp with time zone', { name: 'updatedAt', nullable: true })
  updatedAt: Date | null;

  @ApiProperty()
  @Column('integer', { name: 'updatedBy', nullable: true })
  updatedBy: number | null;

  @ApiProperty()
  @Column('timestamp with time zone', { name: 'deletedAt', nullable: true })
  deletedAt: Date | null;

  @BeforeInsert()
  eventCreatedAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  eventUpdatedAt() {
    this.updatedAt = new Date();
  }

  @BeforeRemove()
  eventDeletedAt() {
    this.deletedAt = new Date();
  }
}

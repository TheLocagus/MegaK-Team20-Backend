import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AdminInterface } from '../types';

@Entity()
export class Admin extends BaseEntity implements AdminInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  isActive: boolean;

  @Column({
    length: 128,
  })
  email: string;

  @Column()
  pwdHash: string;

  @Column({
    nullable: true,
  })
  registerToken: string;

  @Column({
    nullable: true,
    default: null,
  })
  currentTokenId: string | null;
}

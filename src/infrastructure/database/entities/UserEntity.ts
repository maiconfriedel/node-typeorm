import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    type: 'simple-json',
  })
  scopes: string[];
}

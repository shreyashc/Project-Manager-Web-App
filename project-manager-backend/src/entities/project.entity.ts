import { ObjectType, Field } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Task } from "./task.entity";
import { User } from "./user.entity";

@ObjectType()
@Entity()
export class Project extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column({ type: "text" })
  description!: string;

  @Field()
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  @Field(() => [Task])
  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
  /* time stamps */

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

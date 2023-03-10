import { Document } from 'mongoose';
import { IUser } from './IUser.d';

export interface IMovement extends Document {
  user: string | IUser;
  createdBy: string | IUser;
  input: Date;
  output: Date;
  begin: Date;
  end: Date;
}

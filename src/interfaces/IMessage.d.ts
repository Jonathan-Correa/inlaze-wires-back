import { Types, Document } from 'mongoose';

interface IMessage extends Document {
  _id: Types.ObjectId;
  title: string;
  message: string;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

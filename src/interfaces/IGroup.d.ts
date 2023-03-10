import { Types, Document } from 'mongoose';

interface IGroup extends Document {
  name: string;
  options: Record<string, unknown> | any;
  createdBy: Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

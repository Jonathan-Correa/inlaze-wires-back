import { Types, Document } from 'mongoose';

interface ILang extends Document {
  lang: string;
  translations: Record<string, unknown>;
  createdBy: Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

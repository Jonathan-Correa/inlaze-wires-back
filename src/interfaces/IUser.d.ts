import { Types, Document } from 'mongoose';

interface IUser extends Document {
  _id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password: string;
  displayName?: string;
  salt?: string;
  roles: string[] | string;
  group_id?: Types.ObjectId;
  profileImg?: string;
  resetToken?: string;
  expireResetToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  encyptPassword(): void;
  comparePassword(password: string): boolean;
  trimRolesSpaces(): void;
  encryptPasswordPromise(string: string): Record<string, unknown>;
}

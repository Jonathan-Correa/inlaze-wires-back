import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/IUser';

const userSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: 'Please fill your full name',
    },
    email: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: 'Please fill in password',
    },
    salt: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    expireResetToken: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.methods.encyptPassword = function (): void {
  this.salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, this.salt);
};

userSchema.methods.encryptPasswordPromise = function (pass: string) {
  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(pass, salt);

  return {
    salt,
    password,
  };
};

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

export default model<IUser>('User', userSchema);

// server/src/models/user.model.ts

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {

  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;

  comparePassword(enteredPassword: string): Promise<boolean>;
}

// schema
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// parolis heshireba
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    if (error instanceof Error) {
      return next(error);
    }
    next(new Error('Error hashing password'));
  }
});

// parolebis Shedarebis methodi
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model<IUser>('User', UserSchema); //int to model
// ----------------------------------------------------

export default User;
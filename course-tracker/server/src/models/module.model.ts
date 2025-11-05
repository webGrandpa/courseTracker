// server/src/models/module.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { ICourse } from './course.model';


export interface IModule extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  
  
  // connection to 'Course' (Denormalization)
  course: mongoose.Types.ObjectId | ICourse;

  // connection to 'User' (Denormalization)
  user: mongoose.Types.ObjectId | IUser;
  
  createdAt: Date;
  updatedAt: Date;
}

// schema
const ModuleSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Course', 
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Module = mongoose.model<IModule>('Module', ModuleSchema);
export default Module;
// server/src/models/course.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { de } from 'zod/v4/locales';
import { required } from 'zod/v4/core/util.cjs';
import { ref } from 'process';
import { time } from 'console';

//TS interface for course document
export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  instructor?: string;
  description?: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  user: mongoose.Types.ObjectId | IUser; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for course
const CourseSchema: Schema = new Schema(
  {
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    instructor: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
       type: String,
       enum: ['Not Started', 'In Progress', 'Completed'], // 'enum' - access to limited set of values
       default: 'Not Started', // Default value
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true, // add index for faster queries
    }
  },
  {
  timestamps: true,  // Automatically manage createdAt and updatedAt fields
 });

 //model creation
 const Course = mongoose.model<ICourse>('Course', CourseSchema);
 export default Course;
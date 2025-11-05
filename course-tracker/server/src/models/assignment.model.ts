// server/src/models/assignment.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { IModule } from './module.model';

export interface IAssignment extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  dueDate?: Date;
  status: 'Pending' | 'Submitted' | 'Graded';

  module: mongoose.Types.ObjectId | IModule;
  user: mongoose.Types.ObjectId | IUser;

  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Pending', 'Submitted', 'Graded'],
      default: 'Pending',
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Module',
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

const Assignment = mongoose.model<IAssignment>(
  'Assignment',
  AssignmentSchema
);
export default Assignment;
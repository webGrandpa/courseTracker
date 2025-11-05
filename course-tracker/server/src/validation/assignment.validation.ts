// server/src/validation/assignment.validation.ts
import { z } from 'zod';
import mongoose from 'mongoose';

const isValidObjectId = (val: string) => mongoose.Types.ObjectId.isValid(val);

// for creating assignment
export const createAssignmentSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    
    moduleId: z
      .string()
      .refine(isValidObjectId, { message: 'Invalid Module ID' }),
      
    dueDate: z.string().datetime().optional(),
    status: z.enum(['Pending', 'Submitted', 'Graded']).optional(),
  }),
});

// for updating assignment
export const updateAssignmentSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(), // Все поля опциональны
    dueDate: z.string().datetime().optional(),
    status: z.enum(['Pending', 'Submitted', 'Graded']).optional(),
  }),
  params: z.object({
    id: z
      .string()
      .refine(isValidObjectId, { message: 'Invalid Assignment ID' }),
  }),
});

// for assignment ID param validation
export const assignmentIdParamSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(isValidObjectId, { message: 'Invalid Assignment ID' }),
  }),
});

// server/src/validation/module.validation.ts
import { z } from 'zod';
import mongoose from 'mongoose';

const isValidObjectId = (val: string) => mongoose.Types.ObjectId.isValid(val);

export const createModuleSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    
    courseId: z
      .string()
      .refine(isValidObjectId, { message: 'Invalid Course ID' }),
  }),
});

// schema for getting modules for a specific course
export const updateModuleSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
  }),
  params: z.object({
    id: z.string().refine(isValidObjectId, { message: 'Invalid Module ID' }),
  }),
});

// for ID param validation
export const moduleIdParamSchema = z.object({
  params: z.object({
    id: z.string().refine(isValidObjectId, { message: 'Invalid Module ID' }),
  }),
});


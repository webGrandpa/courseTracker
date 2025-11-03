// course-tracker/server/src/validation/course.validation.ts
import { z } from 'zod';
import mongoose from 'mongoose';

// schema for creating a new course

export const createCourseSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required'),
        instructor: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(['Not Started', 'In Progress', 'Completed']).optional(),
    }),
});

// schema for updating an existing course

export const updateCourseSchema = z.object({
    body: z.object({
        title: z.string().min(1).optional(),
        instructor: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(['Not Started', 'In Progress', 'Completed']).optional(),
    }),
    params: z.object({ //validating course ID in params
        id: z
            .string()
            .refine(
                (val) => mongoose.Types.ObjectId.isValid(val),
                { message: 'Invalid Course ID' }
            ),

    }),
});

// schema for deleting a course

export const courseIdParamSchema = z.object({
    params: z.object({
        id: z
            .string()
            .refine(
                val => mongoose.Types.ObjectId.isValid(val),
                { message: 'Invalid Course ID' }
            ),
    }),
});

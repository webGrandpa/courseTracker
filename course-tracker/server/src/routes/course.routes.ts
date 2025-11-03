// server/src/routes/course.routes.ts
import express from 'express';
import { protect } from '../middleware/protect';
import { createCourse, 
         getCourses,
         getCourseById,
         updateCourse,
         deleteCourse 
 } from '../controllers/course.controller';
import validate from '../middleware/validate.middleware';
import { createCourseSchema,
         updateCourseSchema,
         courseIdParamSchema
 } from '../validation/course.validation';

const router = express.Router();

router
    .route('/')
    .post(protect, validate(createCourseSchema), createCourse) // POST/api/courses
    .get(protect, getCourses); // GET/api/courses

router
    .route('/:id')
    .get(protect, validate(courseIdParamSchema), getCourseById) // GET/api/courses/:id
    .put(protect, validate(updateCourseSchema), updateCourse) // PUT/api/courses/:id
    .delete(protect, validate(courseIdParamSchema), deleteCourse); // DELETE/api/courses/:id
    
export default router;
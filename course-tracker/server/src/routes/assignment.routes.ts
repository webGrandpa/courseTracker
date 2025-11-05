// server/src/routes/assignment.routes.ts
import express from 'express';
import { protect } from '../middleware/protect';
import validate from '../middleware/validate.middleware';
import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '../controllers/assignment.controller';
import {
  createAssignmentSchema,
  updateAssignmentSchema,
  assignmentIdParamSchema,
} from '../validation/assignment.validation';

const router = express.Router();

// 'POST /api/assignments'
router
  .route('/')
  .post(protect, validate(createAssignmentSchema), createAssignment);

// 'PUT /api/assignments/:id'
// 'DELETE /api/assignments/:id'
router
  .route('/:id')
  .put(protect, validate(updateAssignmentSchema), updateAssignment)
  .delete(protect, validate(assignmentIdParamSchema), deleteAssignment);

export default router;

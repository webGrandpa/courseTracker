// server/src/routes/module.routes.ts
import express from 'express';
import { protect } from '../middleware/protect';
import {
  createModule,
  updateModule,
  deleteModule,
} from '../controllers/module.controller';
import validate from '../middleware/validate.middleware';
import {
  createModuleSchema,
  updateModuleSchema,
  moduleIdParamSchema,
} from '../validation/module.validation';
import { getAssignmentsForModule } from '../controllers/assignment.controller';

const router = express.Router();

// 'POST /api/modules'
router
  .route('/')
  .post(protect, validate(createModuleSchema), createModule);


router
  .route('/:id')
  .put(protect, validate(updateModuleSchema), updateModule) // 'PUT /api/modules/:id'
  .delete(protect, validate(moduleIdParamSchema), deleteModule); // 'DELETE /api/modules/:id'

router
  .route('/:id/assignments') // 'GET /api/modules/:moduleId/assignments'
  .get(protect, validate(moduleIdParamSchema), getAssignmentsForModule); // 'GET /api/modules/:id/assignments'


export default router;
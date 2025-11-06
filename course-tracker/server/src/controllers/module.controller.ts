// server/src/controllers/module.controller.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Module from '../models/module.model';
import Course from '../models/course.model';
import Assignment from '../models/assignment.model';


// @desc    Create a new module
// @route   POST /api/modules
// @access  Private
export const createModule = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, courseId } = req.body;
  
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }
  
  const course = await Course.findById(courseId);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  if (course.user.toString() !== req.user._id.toString()) {
    res.status(401); 
    throw new Error('User not authorized to add modules to this course');
  }

  const module = await Module.create({
    title,
    description,
    course: courseId,
    user: req.user._id,
  });

  res.status(201).json(module);
});

// @desc    Get all modules for a specific course
// @route   GET /api/courses/:courseId/modules
// @access  Private
export const getModulesForCourse = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }
    
    const courseId = req.params.id;

    // check if user has access to the course
    
    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }
    
    if (course.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to view this course');
    }

    const modules = await Module.find({ course: courseId }).sort({
      createdAt: 1,
    });

    res.status(200).json(modules);
  }
);

// Update module
// @desc    Update a module
// @route   PUT /api/modules/:id
// @access  Private
export const updateModule = asyncHandler(async (req: Request, res: Response) => {
  // find module by id
  const module = await Module.findById(req.params.id);

  // check if module exists
  if (!module) {
    res.status(404);
    throw new Error('Module not found');
  }

  // check if user is authorized to update the module
  if (module.user.toString() !== req.user?._id.toString()) {
    res.status(401);
    throw new Error('User not authorized to update this module');
  }

  // update module
  const updatedModule = await Module.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true } // options
  );

  res.status(200).json(updatedModule);
});

// delete module
// @desc    Delete a module
// @route   DELETE /api/modules/:id
// @access  Private
export const deleteModule = asyncHandler(async (req: Request, res: Response) => {
  const module = await Module.findById(req.params.id);

  if (!module) {
    res.status(404);
    throw new Error('Module not found');
  }

  if (module.user.toString() !== req.user?._id.toString()) {
    res.status(401);
    throw new Error('User not authorized to delete this module');
  }

  await Assignment.deleteMany({ module: req.params.id, user: req.user._id });

  await Module.findByIdAndDelete(req.params.id);

  res
    .status(200)
    .json({ message: 'Module and its assignments deleted', id: req.params.id });
});